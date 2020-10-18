# Home of users profiles

### ID Generation
https://www.uuidgenerator.net/version4 

### Folder structure
users
└── 9383f3b9-9d3f-468d-b5dc-d47bd4460fa2 (UUID)
    ├── profile.en.json
    ├── profile.fr.json
    └──files
       ├── profile.jpg (must be a square image like 600x600)
       ├── resume.en.pdf
       └── resume.fr.pdf

### Configuration
UUID should be placed into folowing files

#### DEV
| File                            | Key                  |
|---------------------------------|----------------------|
| apps/front/.env                 | REACT_APP_PROFILE_ID |
| docker/users/id/profile.xx.json | id                   |

#### PROD
| File                                | Key                  |
|-------------------------------------|----------------------|
| docker/node/secrets/.env.production | REACT_APP_PROFILE_ID |
| docker/users/id/profile.xx.json     | id                   |
