import { User } from 'eris';

import { Context } from '../Command';
import { Resolver } from '../Resolver';

const idRegex: RegExp = /^(?:<@!?)?(\d+)>?$/;

export class UserResolver extends Resolver {
	public async resolve(value: string, { guild }: Context): Promise<User> {
		if (!guild) {
			return;
		}

		let user: User;
		if (idRegex.test(value)) {
			const id = value.match(idRegex)[1];
			user = this.client.users.get(id);
			if (!user) {
				user = await this.client.getRESTUser(id);
			}
		} else {
			const name = value.toLowerCase();
			const users = this.client.users.filter(u => {
				const uName = u.username.toLowerCase() + '#' + u.discriminator;
				return uName.includes(name) || name.includes(uName);
			});
			if (users.length === 1) {
				user = users[0];
			} else {
				// TODO: Show error for multiple user matches
			}
		}

		return user;
	}
}
