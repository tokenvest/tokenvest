import { ListingContract } from "../typechain-types";

export type Listing = {
    seller: string
    token: string
    id: number
    units: number
    numerator: number
    denominator: number
}

export async function getAllListings(listings: ListingContract): Promise<Listing[]> {
    let ls: Listing[] = [];
    let i = 0;
    while (true) {
        try {
            const [seller, token, id, units, num, denom] = await listings.listings(i++);
            ls.push({ seller, token, id, units, numerator: num, denominator: denom });
        } catch (e) {
            break;
        }
    }
    return ls;
}