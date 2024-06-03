export interface Address {
    "@type": string;
    addressCountry: {
        "@type": string;
        name: string;
    };
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    streetAddress: string;
}

export interface Performer {
    "@type": string;
    name: string;
    sameAs: string;
}

export interface Location {
    "@type": string;
    address: Address;
    name: string;
    sameAs: string;
}

export interface MusicEvent {
    "@context": string;
    "@type": string;
    description: string;
    eventAttendanceMode: string;
    eventStatus: string;
    image: string;
    location: Location;
    name: string;
    performers: Performer[];
    startDate: string;
    url: string;
}