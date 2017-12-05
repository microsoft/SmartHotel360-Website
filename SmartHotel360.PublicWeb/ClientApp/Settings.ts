class Settings {
    public production = false;
    public urls = {
        hotels: '',
        bookings: '',
        suggestions: '',
        tasks: '',
        images_Base: '',
        reviews: ''
    };
    public tokens = {
        bingmaps: ''
    };
    public b2c = {
        tenant: '',
        client: '',
        policy: ''
    };

    public fakeAuth = {
        name: '',
        picUrl: '',
        userId: ''
    };
}

declare global {
    interface Window {
        settings: Settings;
    }
}

let clientSettings = new Settings();

if (window.settings) {
    clientSettings = { ...clientSettings, ...window.settings }
}

export let settings = clientSettings;
