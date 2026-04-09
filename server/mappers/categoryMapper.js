export const mapCategoryWithStats = (c) => ({
    id: c.Id ?? c.id,
    name: c.Name ?? c.name,
    leagues: c.leagues,
    teams: c.teams,
    products: c.products
});

export const mapCategory = (c) => ({
    id: c.Id ?? c.id,
    name: c.Name ?? c.name
});