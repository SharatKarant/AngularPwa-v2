interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string, options: SyncEventOptions): Promise<void>;
    };
  }
  
  interface SyncEventOptions {
    data: any;
  }
  