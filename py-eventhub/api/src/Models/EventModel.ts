export class EventModel{
    id: string
    title: string
    date: string
    genre: string
    ticket_url: string
    image_url: string
    venue_name: string
    venue_city: string
    venue_state: string
    venue_url: string
}

export class VenueModel{
    id: string
    name: string
    city: string
    state: string
    address: string
    venue_url: string
    image_url: string
}

export class Paging{
    pageNumber: number
    pageSize: number
    filters: FilterSet[]
}

export class FilterSet{
    token: string
    value: string
}


