class Settings {
    production = false;
    urls = {
        hotels: '',
        bookings: '',
        suggestions: '',
        tasks: '',
        images_Base: '',
        reviews: ''
    };
    tokens = {
        bingmaps: ''
    };
    b2c = {
        tenant: '',
        client: '',
        policy: ''
    };

    fakeAuth = {
        name: '',
        picUrl: '',
        userId: ''
    };
}

let clientSettings = new Settings();
let serverSettings;

export const loadSettings = async () => {
    const response = await fetch('/api/config');
    serverSettings = await response.json();
};

export const settings = () => serverSettings || clientSettings;
