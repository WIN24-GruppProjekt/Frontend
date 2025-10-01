export default async function submitEditProfile(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const pw = formData.get('newPassword');
    const pwConfirm = formData.get('confirmPassword');

    if ((pw || pwConfirm) && pw !== pwConfirm) {
        if (typeof showErrorToast === 'function') {
            showErrorToast('Lösenorden matchar inte');
        }
        else {
            alert('Lösenorden matchar inte');
        }
        return;
    }
    try {
        const res = await fetch('/api/user/profile', {
            method: 'PUT',
            body: formData });

        if (!res.ok) throw new Error(await res.text().catch(() => 'Något gick fel')); 

        if (typeof showSuccessToast === 'function') 
            showSuccessToast('Profil uppdaterad');
            else alert('Profil uppdaterad');       
    } catch (err) {
        if (typeof showErrorToast === 'function') 
            showErrorToast('Något gick fel');
            else alert('Något gick fel');
    }
}