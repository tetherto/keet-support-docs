# Contributing to Keet Support Docs

Thanks for helping improve the Keet support documentation!

## Making a change

1. Fork the repository and create a branch off `main`.
2. Edit the docs — articles live as Markdown/MDX under `content/`. See the
   [README](README.md) for how to install dependencies and run the site locally.
3. Before opening a pull request, run the checks:

   ```bash
   npm run check:internal-links
   npm run check:heading-hierarchy
   npm run build
   ```

4. Open a pull request against `main`, describing what changed and why.

## Developer Certificate of Origin

Contributions are accepted under the repository's [Apache License 2.0](LICENSE).
By submitting a contribution you certify that you agree to the
[Developer Certificate of Origin](https://developercertificate.org/) (DCO): that
you wrote the patch, or otherwise have the right to submit it under that license.

Sign off on every commit by adding a `Signed-off-by` line with your real name
and email:

```
Signed-off-by: Jane Doe <jane@example.com>
```

`git commit -s` adds this line for you.
