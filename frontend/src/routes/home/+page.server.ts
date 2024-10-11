import type { PageServerLoad } from './$types';

export const load = (async ({fetch}) => {
    const response = await fetch('http://localhost:3000/api');
    const data = await response.json();
    return {data};
}) satisfies PageServerLoad;