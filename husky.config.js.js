module.exports = {
  hooks: {
    'pre-push': 'npm run lint && npm run test',
  },
}
