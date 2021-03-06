/*
  Description: This module will be directly called by the server event handler
               when a socket connection is closed or lost.
*/

// module main
exports.run = async (core, server, socket, data) => {
  if (data.cmdKey !== server.cmdKey) {
    // internal command attempt by client, increase rate limit chance and ignore
    return server.police.frisk(socket.remoteAddress, 20);
  }

  // send leave notice to client peers
  server.broadcast({
    cmd: 'echo',
    text: `${socket.remoteAddress} disconnected`
  }, { });

  // commit close just in case
  socket.terminate();
};

// module meta
exports.requiredData = ['cmdKey'];
exports.info = {
  name: 'disconnect',
  usage: 'Internal Use Only',
  description: 'Internally used to relay a disconnection event to connected clients'
};
