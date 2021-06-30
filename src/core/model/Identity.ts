interface Identity{
    id: string,
    name: string,
}

export interface Champion extends Identity {
    picture: string
}

export interface Summoner extends Identity { }

export interface User extends Identity { }

export interface Server extends Identity { }

export interface Channel extends Identity { }