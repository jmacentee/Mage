public class GameService
{
    private readonly LocalStorageService _storage;
    private const string StorageKey = "wizard-games";

    public List<Game> Games { get; private set; } = new();
    public Game? CurrentGame { get; private set; }

    public bool Initialized { get; private set; } = false;
    public event Action? OnInitializedChanged;


    public GameService(LocalStorageService storage)
    {
        _storage = storage;
    }

    public async Task LoadGamesAsync()
    {
        var stored = await _storage.LoadAsync<List<Game>>(StorageKey);
        if (stored != null)
        {
            Games = stored;
            NormalizeGames();
        }
        Initialized = true;
        OnInitializedChanged?.Invoke();
    }

    // Older saved games stored each bid's player key as the player's initials.
// Since initials are no longer part of the model, remap any bid whose key
// does not match a player's name to the player in the same position so
// that older in-progress games can still be played and scored. When a round
// ends up with more than one bid for the same player (an old bid plus one
// re-entered in the current session), keep only the most recent one.
    private void NormalizeGames()
    {
        foreach (var game in Games)
        {
            var names = game.Players.Select(p => p.Name).ToHashSet();
            foreach (var round in game.Rounds)
            {
                for (int i = 0; i < round.Bids.Count; i++)
                {
                    var bid = round.Bids[i];
                    if (!names.Contains(bid.PlayerName) && i < game.Players.Count)
                    {
                        bid.PlayerName = game.Players[i].Name;
                    }
                }

                var lastBidPerPlayer = new Dictionary<string, int>();
                for (int i = 0; i < round.Bids.Count; i++)
                {
                    lastBidPerPlayer[round.Bids[i].PlayerName] = i;
                }
                round.Bids = round.Bids
                    .Select((bid, i) => new { bid, i })
                    .Where(x => lastBidPerPlayer[x.bid.PlayerName] == x.i)
                    .Select(x => x.bid)
                    .ToList();
            }
        }
    }

    public void StartNewGame(Game game)
    {
        CurrentGame = game;
        Games.Insert(0, game);
    }

    public void ResumeGame(Guid gameId)
    {
        CurrentGame = Games.FirstOrDefault(g => g.Id == gameId);
    }

    public void EndCurrentGame()
    {
        CurrentGame = null;
    }

    public void SaveGame()
    {
        _ = _storage.SaveAsync(StorageKey, Games);
    }

    public void ClearGames()
    {
        Games.Clear();
        CurrentGame = null;
        _ = _storage.RemoveAsync(StorageKey);
    }
}