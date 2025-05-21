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
            Games = stored;
        Initialized = true;
        OnInitializedChanged?.Invoke();
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