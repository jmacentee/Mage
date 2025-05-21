public class Game
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime StartDate { get; set; } = DateTime.Now;
    public List<Player> Players { get; set; } = new();
    public List<Round> Rounds { get; set; } = new();
    public bool IsComplete { get; set; } = false;
}