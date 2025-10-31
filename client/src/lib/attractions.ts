export type Attraction = { name: string; image?: string }

// Minimal curated attractions per city; images optional (we rely on gradient tiles if remote is blocked)
export const ATTRACTIONS: Record<string, Attraction[]> = {
  Jaipur: [
    { name: 'Hawa Mahal' },
    { name: 'City Palace' },
    { name: 'Amer Fort' },
    { name: 'Jantar Mantar' },
  ],
  Varanasi: [
    { name: 'Dashashwamedh Ghat' },
    { name: 'Assi Ghat' },
    { name: 'Kashi Vishwanath' },
    { name: 'Manikarnika Ghat' },
  ],
  Mumbai: [
    { name: 'Marine Drive' },
    { name: 'Gateway of India' },
    { name: 'Colaba' },
    { name: 'Bandra-Worli Sea Link' },
  ],
  Goa: [
    { name: 'Baga Beach' },
    { name: 'Aguada Fort' },
    { name: 'Chapora' },
    { name: 'Mangroves' },
  ],
  Rishikesh: [
    { name: 'Laxman Jhula' },
    { name: 'Triveni Ghat' },
    { name: 'Neer Waterfall' },
  ],
  Alleppey: [
    { name: 'Vembanad Lake' },
    { name: 'Backwaters' },
    { name: 'Houseboats' },
  ],
  Delhi: [
    { name: 'India Gate' },
    { name: 'Qutub Minar' },
    { name: 'Humayun’s Tomb' },
  ],
  Agra: [
    { name: 'Taj Mahal' },
    { name: 'Agra Fort' },
    { name: 'Mehtab Bagh' },
  ],
  Udaipur: [
    { name: 'City Palace' },
    { name: 'Lake Pichola' },
    { name: 'Jag Mandir' },
  ],
  Amritsar: [
    { name: 'Golden Temple' },
    { name: 'Wagah Border' },
  ],
  Hyderabad: [
    { name: 'Charminar' },
    { name: 'Golconda Fort' },
  ],
  Kolkata: [
    { name: 'Victoria Memorial' },
    { name: 'Howrah Bridge' },
    { name: 'Trams' },
  ],
  Hampi: [
    { name: 'Stone Chariot' },
    { name: 'Vijaya Vittala Temple' },
  ],
  Darjeeling: [
    { name: 'Toy Train' },
    { name: 'Tiger Hill' },
  ],
  Munnar: [
    { name: 'Tea Estates' },
    { name: 'Top Station' },
  ],
  Shimla: [
    { name: 'Viceregal Lodge' },
    { name: 'Mall Road' },
  ],
  Puducherry: [
    { name: 'White Town' },
    { name: 'Promenade Beach' },
  ],
  Havelock: [
    { name: 'Radhanagar Beach' },
    { name: 'Snorkeling' },
  ],
}

export function getCityKey(location: string): string {
  // Extract city part before comma
  const city = location.split(',')[0].trim()
  return city
}
