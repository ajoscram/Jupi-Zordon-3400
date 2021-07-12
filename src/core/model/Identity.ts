interface Identity{
    readonly id: string,
    readonly name: string,
}

export interface Champion extends Identity {
    readonly picture: string
}

export interface Summoner extends Identity { }

export interface User extends Identity { }

export interface ServerIdentity { }

export interface Channel extends Identity { }