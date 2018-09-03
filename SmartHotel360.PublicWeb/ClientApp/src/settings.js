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

export const loadSettings = async () => {
    const response = await fetch('/api/config');
    const json = await response.json();
    console.log(json);

    clientSettings = { ...clientSettings, ...json }
};

export const settings = clientSettings;
