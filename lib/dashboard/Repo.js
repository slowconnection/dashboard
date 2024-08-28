export default class Repo {
    constructor() {
        this.infoURL = '/api/GetInfo.asp';
        this.dashboardDataURL = '/api/GetDashboardData.asp';
        this.drilldownURL = '/api/GetDrilldownData.asp';
        this.componentsURL = '/api/GetDashboardComponents.asp';
        this.valueListURL = '/api/GetValueList.asp';
    }

    async getDataAsync(url, filters) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
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

    async getValueList(listname) {
        let filters = `listName=${encodeURIComponent(listname)}`;
        return await this.getDataAsync(this.valueListURL, filters);
    }
    
}