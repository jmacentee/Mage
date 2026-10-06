using System.Text.Json.Serialization;

public class Bid
{
    // Serialized as "PlayerInitials" so older saved games (where this slot held the
// player's initials) still load; now holds the player's name.
    [JsonPropertyName("PlayerInitials")]
    public string PlayerName { get; set; } = string.Empty;
    public int BidValue { get; set; }
    public bool? Success { get; set; }
    public int? TricksTaken { get; set; }

    public int RoundPoints { get; set; } = 0;
}