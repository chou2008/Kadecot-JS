module.exports =
{
  servers: {
    rest: {
      port: 4035
    },
    wamp: {
      protocol: 'ws:',
      hostname: '127.0.0.1',
      port: 41314,
      pathname: '/ws',
      slashes: true
    }
  }
}
;
