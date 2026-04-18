export const mapUser = (u) => ({
    id: u.Id,
    firstName: u.FirstName,
    lastName: u.LastName,
    email: u.Email,
    role: u.Role,
    bonusPoints: u.BonusPoints,
    createdAt: u.CreatedAt,
    updatedAt: u.UpdatedAt
});