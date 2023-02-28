# Typescript Turborepo

## About

This is a [Turborepo](https://turborepo.org/) playground for personal projects and utilities I'd like to share on NPM.
Used the [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) repo as a starting point.

### Setup dependencies

```diff
# Install dependencies
pnpm i

# In packages/db/prisma update schema.prisma provider to use sqlite
# or use your own database provider
- provider = "postgresql"
+ provider = "sqlite"

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env
```

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).

A [blog post](https://jumr.dev/blog/t3-turbo) where I wrote how to migrate a T3 app into this.
