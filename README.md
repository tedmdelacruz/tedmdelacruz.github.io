 ## Development

Start the development server at http://localhost:1313
```sh
hugo server
```

Create a new post
```sh
hugo new posts/your-page-name.md
```

Push to master and deploy to Github pages
```sh
git push origin master
```
_Note: no need to build in local, GitHub actions already handle that_

## Updating the custom Hugo theme

Add upstream (original Tale theme repository)

```sh
git remote add upstream https://github.com/EmielH/tale-hugo.git
```

Navigate to the theme in local and fetch any updates from upstream
```sh
cd /path/to/tale
git fetch upstream
git merge upstream/master
```

Let the static site know that there are changes to the theme
```sh
cd /path/to/static-site
cd themes/tale
git pull origin master
cd /path/to/static-site
git commit ...
```

## Adding custom CSS without editing the theme

To add any custom CSS, edit the `static/styles.css` styesheet
