import fallbackImg from '../assets/fallback.svg'

// Local-by-ID map removed to avoid asset resolution issues; we use
// explicit remote URL overrides where provided, else fallback.
// const byId: Record<number, string> = {}

// External image overrides provided by user for specific destinations
const urlOverrides: Record<number, string> = {
  // varanasi
  2: 'https://imgs.search.brave.com/gDQVbgciwegQiSMUOY_i437Q8uM6Hj6lSdfVkJvd3d8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvODcz/Nzk2MDAvcGhvdG8v/dmFyYW5hc2ktbW9y/bmluZy5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9ODNFbkxV/Qmt2ZWdadjdfMXN3/QzRxWnRDZzJUdE9G/QzNBUHBoNEIzNEdp/MD0',
  // Goa
  4: 'https://imgs.search.brave.com/e8z18SEXtN-yyo4ARbtVvgcqCeGku3Bsg4cgeGZKras/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS50YWNkbi5jb20v/bWVkaWEvYXR0cmFj/dGlvbnMtc3BsaWNl/LXNwcC02NzR4NDQ2/LzA2Lzc0L2I5LzNl/LmpwZw',
  // Kerala houseboat
  6: 'https://imgs.search.brave.com/nXqey7DauYohYhtqkcpgc5IJVXzpNV18U0uPaCxJi-s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNy8w/OS8yNy8wNi8zMS9o/b3VzZWJvYXQta2Vy/YWxhLTI3OTExMTlf/NjQwLmpwZw',
  // Delhi - India Gate
  7: 'https://imgs.search.brave.com/RkTqWjOPHryEf8jEUjxqCJdVLIw7agV_vopFonIprRQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzQwLzkzLzQ3/LzM2MF9GXzk0MDkz/NDc5MV94QjNBc3pn/eWZPNUkzQlVpVDJV/NTkwT0kwWlFxVno0/YS5qcGc',
  // Agra - Taj Mahal sunrise
  8: 'https://imgs.search.brave.com/lweFa5tMDKx-zfFdf3pdFmPusglx5C1GjgoV-82kIkA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vYXdvcmxk/b2ZkZXN0aW5hdGlv/bnMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIyLzEwL0RT/QzA5NzMwLWUxNjY0/NzI1NDE4MjQyLmpw/Zz9maXQ9OTQ1LDYz/MCZzc2w9MQ',
  // Udaipur - lake
  9: 'https://imgs.search.brave.com/dLhdf6OHNMIk8RmCmmXhinyojShEvXBsApz05FK4Hao/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE5/NTcxMTU4NS9waG90/by91ZGFpcHVyLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1o/ZEVia085QUtiSFhR/TmJpZmVDVmdiRmpn/azVSeXN5U01zaHVr/b0VQRDlNPQ',
  // Amritsar - Golden temple
 10: 'https://imgs.search.brave.com/FvY7eZGeQj4-fk-GXaY3iXpsDx66ye9Sv3WlFAEWi6M/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTIx/OTMzMjYwL3Bob3Rv/L2hhcm1hbmRpci1z/YWhpYi10ZW1wbGUt/aW4tYW1yaXRzYXIt/aW5kaWEuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPU1EYjZB/YlhLYmxtck5iWmJT/aWxLbGZoRlVnaXNi/WWxObExCRy1ITVZD/RDA9',
}

// Prefer remote URL if provided; else local curated image for known IDs; else fallback
export function getExperienceImage(id?: number, remoteUrl?: string) {
  return (id && urlOverrides[id]) || remoteUrl || fallbackImg
}

// export function getLocalImage(id?: number) {
//   return undefined
// }

export { fallbackImg }
