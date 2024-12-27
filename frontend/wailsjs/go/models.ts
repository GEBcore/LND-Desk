export namespace frontend {
	
	export class FileFilter {
	    DisplayName: string;
	    Pattern: string;
	
	    static createFrom(source: any = {}) {
	        return new FileFilter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.DisplayName = source["DisplayName"];
	        this.Pattern = source["Pattern"];
	    }
	}
	export class OpenDialogOptions {
	    DefaultDirectory: string;
	    DefaultFilename: string;
	    Title: string;
	    Filters: FileFilter[];
	    ShowHiddenFiles: boolean;
	    CanCreateDirectories: boolean;
	    ResolvesAliases: boolean;
	    TreatPackagesAsDirectories: boolean;
	
	    static createFrom(source: any = {}) {
	        return new OpenDialogOptions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.DefaultDirectory = source["DefaultDirectory"];
	        this.DefaultFilename = source["DefaultFilename"];
	        this.Title = source["Title"];
	        this.Filters = this.convertValues(source["Filters"], FileFilter);
	        this.ShowHiddenFiles = source["ShowHiddenFiles"];
	        this.CanCreateDirectories = source["CanCreateDirectories"];
	        this.ResolvesAliases = source["ResolvesAliases"];
	        this.TreatPackagesAsDirectories = source["TreatPackagesAsDirectories"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace lnrpc {
	
	export class Feature {
	    name?: string;
	    is_required?: boolean;
	    is_known?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Feature(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.is_required = source["is_required"];
	        this.is_known = source["is_known"];
	    }
	}
	export class Chain {
	    chain?: string;
	    network?: string;
	
	    static createFrom(source: any = {}) {
	        return new Chain(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chain = source["chain"];
	        this.network = source["network"];
	    }
	}
	export class GetInfoResponse {
	    version?: string;
	    commit_hash?: string;
	    identity_pubkey?: string;
	    alias?: string;
	    color?: string;
	    num_pending_channels?: number;
	    num_active_channels?: number;
	    num_inactive_channels?: number;
	    num_peers?: number;
	    block_height?: number;
	    block_hash?: string;
	    best_header_timestamp?: number;
	    synced_to_chain?: boolean;
	    synced_to_graph?: boolean;
	    testnet?: boolean;
	    chains?: Chain[];
	    uris?: string[];
	    features?: {[key: number]: Feature};
	    require_htlc_interceptor?: boolean;
	    store_final_htlc_resolutions?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new GetInfoResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.commit_hash = source["commit_hash"];
	        this.identity_pubkey = source["identity_pubkey"];
	        this.alias = source["alias"];
	        this.color = source["color"];
	        this.num_pending_channels = source["num_pending_channels"];
	        this.num_active_channels = source["num_active_channels"];
	        this.num_inactive_channels = source["num_inactive_channels"];
	        this.num_peers = source["num_peers"];
	        this.block_height = source["block_height"];
	        this.block_hash = source["block_hash"];
	        this.best_header_timestamp = source["best_header_timestamp"];
	        this.synced_to_chain = source["synced_to_chain"];
	        this.synced_to_graph = source["synced_to_graph"];
	        this.testnet = source["testnet"];
	        this.chains = this.convertValues(source["chains"], Chain);
	        this.uris = source["uris"];
	        this.features = source["features"];
	        this.require_htlc_interceptor = source["require_htlc_interceptor"];
	        this.store_final_htlc_resolutions = source["store_final_htlc_resolutions"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetStateResponse {
	    state?: number;
	
	    static createFrom(source: any = {}) {
	        return new GetStateResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.state = source["state"];
	    }
	}

}

export namespace main {
	
	export class ChainInfo {
	    MempoolBlock: number;
	    LndInfo?: lnrpc.GetInfoResponse;
	
	    static createFrom(source: any = {}) {
	        return new ChainInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.MempoolBlock = source["MempoolBlock"];
	        this.LndInfo = this.convertValues(source["LndInfo"], lnrpc.GetInfoResponse);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

