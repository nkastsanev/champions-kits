export const mapLeague = (l) => ({
    id: l.Id ?? l.id,
    categoryId: l.CategoryId ?? l.categoryId,
    name: l.Name ?? l.name
});

export const mapLeagueWithStats = (l) => ({
    id: l.id,
    name: l.name,
    categoryId: l.categoryId,
    categoryName: l.categoryName,
    teams: l.teams,
    products: l.products
})