from fastf1.ergast import Ergast

ergast = Ergast()


def _pick_column(df, *candidates):
    for name in candidates:
        if name in df.columns:
            return name
    return None


def get_driver_standings(year: int):
    response = ergast.get_driver_standings(season=year)
    if not response.content:
        raise RuntimeError(f"No driver standings available for {year}.")

    df = response.content[0]

    given_col = _pick_column(df, "driverGivenName", "givenName")
    family_col = _pick_column(df, "driverFamilyName", "familyName")
    code_col = _pick_column(df, "driverCode", "code")
    constructor_col = _pick_column(df, "constructorNames", "constructorName")

    records = []
    for _, row in df.iterrows():
        first = row[given_col] if given_col else ""
        last = row[family_col] if family_col else ""
        full_name = f"{first} {last}".strip()
        if not full_name and code_col:
            full_name = row[code_col]

        records.append({
            "position": row.get("position"),
            "points": row.get("points"),
            "wins": row.get("wins"),
            "driverName": full_name or "Unknown",
            "team": row[constructor_col] if constructor_col else "",
        })
    return records


def get_constructor_standings(year: int):
    response = ergast.get_constructor_standings(season=year)
    if not response.content:
        raise RuntimeError(f"No constructor standings available for {year}.")

    df = response.content[0]
    name_col = _pick_column(df, "constructorName")

    records = []
    for _, row in df.iterrows():
        records.append({
            "position": row.get("position"),
            "points": row.get("points"),
            "wins": row.get("wins"),
            "constructorName": row[name_col] if name_col else "Unknown",
        })
    return records