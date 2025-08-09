// ecosystem.config.js
module.exports = { 
  apps: [
    {
      name: 'strapi',
      cwd: './backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
    },
    {
      name: 'next',
      cwd: './mi-frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
