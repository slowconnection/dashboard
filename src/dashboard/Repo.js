export default class Repo {
    constructor(config) {
        this.infoURL = config.infoURL || '/api/GetInfo.asp';
        this.dashboardDataURL = config.dashboardDataURL || '/api/GetDashboardData.asp';
        this.drilldownURL = config.drilldownURL || '/api/GetDrilldownData.asp';
        this.componentsURL = config.componentsURL || '/api/GetDashboardComponents.asp';
    }

    async getDataAsync(url, filters) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: filters
        });

        try {
            const data = await response.json();
            return data;
        } catch (e) {
            return [];
        }

    }

    async getDashboardData(filters) {
        return await this.getDataAsync(this.dashboardDataURL, filters);
    }

    async getDashboardComponents(id) {
        let filters = `filterDashboard=${encodeURIComponent(id)}`;
        return await this.getDataAsync(this.componentsURL, filters);
    }

    async getInfoForComponent(id) {
        let filters = `filterComponent=${encodeURIComponent(id)}`;
        return await this.getDataAsync(this.infoURL, filters);
    }

    async getDrilldownForComponent() {
        return 'Not yet implemented';
    }
}