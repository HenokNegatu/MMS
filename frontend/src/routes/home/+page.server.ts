import type { Actions, PageServerLoad } from './$types';

export const load = (async ({fetch}) => {
    const response = await fetch('http://localhost:3000/api');
    const data = await response.json();
    return {data};
}) satisfies PageServerLoad;


export const actions: Actions = {
    upload: async ({request, fetch}) => {
        const formData = await request.formData();
        
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const res = await response.text();
            return { success: true, message: res };
        }
        return { success: false, error: 'Failed to upload file' };
    }
};
