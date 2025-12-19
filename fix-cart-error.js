    trackProductView(productName, category, price) {
        const existingView = this.userData.viewedProducts.find(
            item => item.name === productName
        );

        if (existingView) {
            existingView.viewCount += 1;
            existingView.lastViewed = new Date().toISOString();
        } else {
            this.userData.viewedProducts.push({
                name: productName,
                category: category,
                price: price,
                viewCount: 1,
                firstViewed: new Date().toISOString(),
                lastViewed: new Date().toISOString()
            });
        }

        this.userData.stats.totalViews += 1;
        this.updatePreferences(category, price);
        this.saveUserData();
        this.updateDashboardDisplay();
    }
