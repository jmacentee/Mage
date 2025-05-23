public class Bid
{
    public string PlayerInitials { get; set; } = string.Empty;
    public int BidValue { get; set; }
    public bool? Success { get; set; }
    public int? TricksTaken { get; set; }

    public int RoundPoints { get; set; } = 0;
}