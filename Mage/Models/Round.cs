public class Round
{
    public int RoundNumber { get; set; }
    public int DealerIndex { get; set; }
    public int FirstPlayerIndex { get; set; }
    public List<Bid> Bids { get; set; } = new();
}