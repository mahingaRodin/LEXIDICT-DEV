# Screen Flow Map

```mermaid
flowchart TB
    Splash[Splash 2.2s] --> Home

    subgraph Tabs["Floating Tab Bar — always visible"]
        Home[Home]
        History[History]
        Favorites[Favorites]
        Learn[Learn]
        Settings[Settings]
        WordDetail[Word Detail]
    end

    Home -->|search| WordDetail
    History -->|tap row| WordDetail
    Favorites -->|tap row| WordDetail
    Learn -->|discover| WordDetail
    Drawer[Drawer] -->|recent word| WordDetail
    Drawer -->|menu| Tabs

    WordDetail -->|synonym| WordDetail
    WordDetail -->|back| Home
```

## Figma frame naming convention

```
01-Splash
02-Home-Default
02-Home-Suggestions
02-Home-Empty-Hint
03-WordDetail-Loading
03-WordDetail-Success
03-WordDetail-NotFound
03-WordDetail-NetworkError
04-History-List
04-History-Empty
05-Favorites-List
05-Favorites-Empty
06-Learn
07-Settings
08-Drawer-Open
09-Components-Library
10-Utilities-Toasts-Loaders
```

Use **Light** and **Dark** suffix variants: `02-Home-Default-Light`, `02-Home-Default-Dark`.
