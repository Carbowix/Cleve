module.exports = {
    once: true,
	run: () => {
        console.warn('[CLEVE] Disconnecting, Good bye!');
        process.exit(0);
    }
}