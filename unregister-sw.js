navigator.serviceWorker.getRegistrations().then(regs => { for(let reg of regs) { reg.unregister() } }); console.log('Service Workers supprimés');
