import CustomElement from "@/scripts/elements/CustomElement";

export default class RandomInput extends CustomElement {
    protected static readonly customTag: string = 'random-input';
    protected customProperties() {
        return {
            initiallyLoadedFields: Array,
        }
    }

    protected customActions(): string[] {
        return [
            "loadUsername",
            "loadPassword",
        ]
    }

    protected customTargets(): string[] {
        return [
            'username',
            'password',
            'repeatPassword'
        ]
    }

    declare initiallyLoadedFields: string[];
    declare $usernameTarget: HTMLInputElement;
    declare $passwordTarget: HTMLInputElement
    declare $repeatPasswordTarget: HTMLInputElement;
    declare hasUsernameTarget: boolean;

    private readonly usernameEndpoint: string = 'https://usernameapiv1.vercel.app/api/random-usernames';
    private readonly passwordEndpoint: string = "https://www.psswrd.net/api/v1/password/";

    connectedCallback() {
        this.load();
        this.appendButtons();
    }

    appendButtons() {
        [this.$usernameTarget, this.$passwordTarget].forEach((target) => {
            console.log(target);
            target.insertAdjacentHTML('afterend', `
                <svg viewBox="0 0 128 128" fill="currentColor" data-action="click->forms--random-input#generatePassword" title="Generate a random password" class="clickable"><defs><path id="notoV1GameDie0" d="M127.12 55.14c-.33-10.75-1.33-21.92-7.21-31.44c-4.98-8.06-12.72-12.53-21.34-15.67c-4.74-1.74-9.7-3.19-14.65-4.23c-10.56-2.21-23.5-4.77-34.07-1.95c-9.88 2.63-18.78 9.4-26.63 15.82C13.42 25.69 2.47 35.75.86 49.14C-1.29 67.13 2.09 72.26 8.02 88.8c2.72 7.59 7.31 21.53 15.02 25.07c8 3.67 24.72 8.54 33.35 10c9.34 1.58 20.73 4.81 28.96 2.96c9.4-2.11 17.92-11.17 24.82-17.69c6.31-5.96 12.29-10.53 15.03-17.8c3.98-10.53 2.26-25.06 1.92-36.2"></path></defs><use fill="#adadad" href="#notoV1GameDie0"></use><clipPath id="notoV1GameDie1"><use href="#notoV1GameDie0"></use></clipPath><path fill="#e0e0e0" d="M10.95 26.34C21.03 16.15 34.79 3.22 50.48-.85c9.85-2.56 20.34-2.04 30.16-.08c10.06 2.01 25.09 5.65 32.47 13.35c5.14 5.36 3.46 13.68-2.04 18.33c-10.92 9.27-32.46 29.38-41.38 31.86c-3.1.87-7.59.91-10.42.8c-5.89-.21-33.01-6.68-47.69-12.13c-4.89-1.81-8.54-3.55-9.24-8.16c-.73-4.78 3.91-12.04 8.61-16.78" clip-path="url(#notoV1GameDie1)"></path><path fill="#cccbcb" d="M74.63 127.9c-2.18 3.08-12.18-.43-19.64-1.52c-7.19-1.07-26.07-6.33-32.6-8.85c-12.45-4.82-18.96-37.41-20.9-43.78c-2.76-9.02-5.15-14.95.77-17.23c2.15-.83 7.06.19 13.11 1.52c8.93 1.98 36.93 9.35 44.7 12.19c3.68 1.34 6.05 4.83 7.42 8.49c2.63 7.01 6.43 31.09 6.8 35.48c.29 3.36 2.01 11.36.34 13.7" clip-path="url(#notoV1GameDie1)"></path><path fill="#adadad" d="M127.89 93.1c-3.06 6.32-8.71 11.33-13.6 16.34c-6.75 6.9-16.96 16.94-26.65 18.86c-4.9.97-7.23-6.58-8.6-10.93c-.4-1.25-2.48-13.14-3.01-16.31c-1.26-7.38-2.95-15.04-2.12-22.57c.57-5.17 1.63-9.44 4.88-13.18c3.5-4.01 7.92-7.39 12.02-10.53c6.23-4.8 12.19-9.95 18.44-14.72c4.3-3.29 10.4-9.06 15.72-4.2c4.24 3.87 3.98 13.53 4.2 18.8c.2 4.64.78 9.18.85 13.83c.1 8.02 1.44 17.24-2.13 24.61" clip-path="url(#notoV1GameDie1)"></path><path fill="#ec6c30" d="M45.51 36.23c-1.48-4.52 1.14-9.96 5.65-12.7c6.72-4.08 19-4.52 23.96 2.81c.35.52.66 1.05.93 1.61c2.57 5.46-1.51 10.51-6.1 12.9c-5.6 2.9-13.51 3.63-19.29.75c-2.17-1.07-4.38-3.01-5.15-5.37"></path><path fill="#2f2f2f" d="M21.11 79.15c-2.35-1.15-4.46-3.66-4.75-6.28c-.15-1.4.44-3.05 1.61-3.91c1.52-1.13 3.55-1.04 5.29-.53c2.84.83 5.33 2.91 6.11 5.77c1.48 5.34-4.31 6.9-8.26 4.95M52.3 86.2c-2.33-1.14-4.46-3.65-4.74-6.27c-.15-1.4.44-3.05 1.59-3.92c1.52-1.12 3.57-1.04 5.31-.53c2.84.83 5.32 2.9 6.11 5.76c1.48 5.36-4.3 6.92-8.27 4.96m36.9-7.12c1.45-1.96 2.13-4.96 1.24-7.26c-.47-1.23-1.68-2.35-3-2.57c-1.75-.28-3.41.68-4.64 1.84c-2.01 1.91-3.18 4.7-2.61 7.42c1.07 5.08 6.54 3.9 9.01.57m23.56-21.8c1.44-1.96 2.13-4.96 1.25-7.27c-.48-1.23-1.68-2.35-3.01-2.57c-1.75-.28-3.41.67-4.64 1.83c-2.02 1.91-3.2 4.71-2.62 7.43c1.08 5.09 6.56 3.91 9.02.58m4.04 27.55c1.21-1.68 1.79-4.25 1.06-6.21c-.39-1.05-1.39-2.01-2.51-2.19c-1.46-.24-2.84.58-3.88 1.58c-1.67 1.63-2.66 4.03-2.19 6.35c.89 4.34 5.46 3.32 7.52.47m-21.14 19.85c1.28-1.78 1.91-4.49 1.12-6.58c-.41-1.11-1.47-2.13-2.64-2.32c-1.55-.25-3.02.62-4.11 1.67c-1.78 1.74-2.83 4.26-2.33 6.72c.93 4.6 5.77 3.52 7.96.51m-59.02-9.8c-2.18-1.29-4.06-3.69-4.3-5.99c-.13-1.21.38-2.63 1.39-3.36c1.36-.98 3.26-.89 4.94-.43c2.91.81 5.62 2.9 6.55 5.79c1.8 5.62-4.62 6.35-8.58 3.99m-8.63 11.32c-1.84-1.1-3.44-3.13-3.65-5.08c-.12-1.02.31-2.23 1.18-2.85c1.16-.83 2.77-.75 4.19-.35c2.46.68 4.77 2.45 5.55 4.9c1.53 4.76-3.9 5.37-7.27 3.38M56 112.54c-1.95-1.15-3.63-3.29-3.85-5.35c-.12-1.08.34-2.35 1.23-3c1.22-.88 2.92-.8 4.42-.38c2.6.73 5.03 2.6 5.85 5.18c1.62 5.01-4.12 5.66-7.65 3.55"></path></svg>
            `);
        })
    }

    loadUsername() {
        if (this.hasUsernameTarget) {
            fetch(this.usernameEndpoint)
                .then(response => response.json())
                .then(data => {
                    (this.$usernameTarget as HTMLInputElement).value = `@${data.usernames[0]}`;
                    this.$usernameTarget?.dispatchEvent(new Event('change', {bubbles: true}));
                })
                .catch(error => console.error(error));
        }
    }

    loadPassword() {
        fetch(this.passwordEndpoint)
            .then(response => response.json())
            .then(data => {
                [this.$passwordTarget, this.$repeatPasswordTarget].forEach((passwordTarget) => {
                    passwordTarget.value = data.password;
                    passwordTarget.dispatchEvent(new Event('change', { bubbles: true }));
                });
            })
            .catch(error => console.error(error));
    }

    load() {
        this.initiallyLoadedFields.forEach(field => {
            if (field === 'username') {
                this.loadUsername();
            } else if (field === 'password') {
                this.loadPassword();
            }
        });
    }
}