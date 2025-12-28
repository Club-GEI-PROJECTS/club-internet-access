import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RouterOSClient } from 'routeros-client';

export interface HotspotUser {
  id?: string;
  name: string;
  password: string;
  profile?: string;
  'limit-uptime'?: string;
  'shared-users'?: number;
  comment?: string;
  disabled?: boolean;
}

export interface ActiveUser {
  id: string;
  user: string;
  address: string;
  'uptime': string;
  'bytes-in': number;
  'bytes-out': number;
  'packets-in': number;
  'packets-out': number;
}

@Injectable()
export class MikroTikService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MikroTikService.name);
  private client: RouterOSClient;
  private connected = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const host = this.configService.get<string>('MIKROTIK_HOST', '192.168.88.1');
      const user = this.configService.get<string>('MIKROTIK_USER', 'admin');
      const password = this.configService.get<string>('MIKROTIK_PASSWORD');

      if (!password) {
        this.logger.warn('MIKROTIK_PASSWORD not configured');
        return;
      }

      this.client = new RouterOSClient({
        host,
        user,
        password,
        port: parseInt(this.configService.get<string>('MIKROTIK_PORT', '8728')),
        timeout: 10000,
      });

      await this.client.connect();
      this.connected = true;
      this.logger.log(`✅ Connected to MikroTik at ${host}`);
    } catch (error) {
      this.logger.error(`❌ Failed to connect to MikroTik: ${error.message}`);
      this.connected = false;
    }
  }

  private async disconnect(): Promise<void> {
    if (this.client && this.connected) {
      try {
        await this.client.close();
        this.connected = false;
        this.logger.log('Disconnected from MikroTik');
      } catch (error) {
        this.logger.error(`Error disconnecting: ${error.message}`);
      }
    }
  }

  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('Not connected to MikroTik. Please check configuration.');
    }
  }

  /**
   * Créer un utilisateur hotspot
   */
  async createHotspotUser(userData: HotspotUser): Promise<any> {
    this.ensureConnected();

    try {
      const menu = this.client.menu('/ip/hotspot/user');
      const result = await menu.add({
        name: userData.name,
        password: userData.password,
        profile: userData.profile || 'default',
        'limit-uptime': userData['limit-uptime'] || '1d',
        'shared-users': userData['shared-users'] || 1,
        comment: userData.comment || '',
        disabled: userData.disabled || false,
      });

      this.logger.log(`✅ Created hotspot user: ${userData.name}`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Failed to create user ${userData.name}: ${error.message}`);
      throw new Error(`Failed to create hotspot user: ${error.message}`);
    }
  }

  /**
   * Supprimer un utilisateur hotspot
   */
  async deleteHotspotUser(username: string): Promise<void> {
    this.ensureConnected();

    try {
      const menu = this.client.menu('/ip/hotspot/user');
      const users = await menu.query({ name: username }).find();
      
      if (users.length === 0) {
        throw new Error(`User ${username} not found`);
      }

      await menu.remove(users[0].id);
      this.logger.log(`✅ Deleted hotspot user: ${username}`);
    } catch (error) {
      this.logger.error(`❌ Failed to delete user ${username}: ${error.message}`);
      throw new Error(`Failed to delete hotspot user: ${error.message}`);
    }
  }

  /**
   * Obtenir un utilisateur hotspot
   */
  async getHotspotUser(username: string): Promise<any> {
    this.ensureConnected();

    try {
      const menu = this.client.menu('/ip/hotspot/user');
      const users = await menu.query({ name: username }).find();
      
      if (users.length === 0) {
        return null;
      }

      return users[0];
    } catch (error) {
      this.logger.error(`❌ Failed to get user ${username}: ${error.message}`);
      throw new Error(`Failed to get hotspot user: ${error.message}`);
    }
  }

  /**
   * Lister tous les utilisateurs hotspot
   */
  async listHotspotUsers(): Promise<any[]> {
    this.ensureConnected();

    try {
      const menu = this.client.menu('/ip/hotspot/user');
      const users = await menu.getAll();
      return users;
    } catch (error) {
      this.logger.error(`❌ Failed to list users: ${error.message}`);
      throw new Error(`Failed to list hotspot users: ${error.message}`);
    }
  }

  /**
   * Obtenir les utilisateurs actifs (connectés)
   */
  async getActiveUsers(): Promise<ActiveUser[]> {
    this.ensureConnected();

    try {
      const menu = this.client.menu('/ip/hotspot/active');
      const activeUsers = await menu.getAll();
      return activeUsers.map((user: any) => ({
        id: user['.id'],
        user: user.user,
        address: user.address,
        uptime: user.uptime,
        'bytes-in': parseInt(user['bytes-in'] || '0'),
        'bytes-out': parseInt(user['bytes-out'] || '0'),
        'packets-in': parseInt(user['packets-in'] || '0'),
        'packets-out': parseInt(user['packets-out'] || '0'),
      }));
    } catch (error) {
      this.logger.error(`❌ Failed to get active users: ${error.message}`);
      throw new Error(`Failed to get active users: ${error.message}`);
    }
  }

  /**
   * Déconnecter un utilisateur actif
   */
  async disconnectUser(sessionId: string): Promise<void> {
    this.ensureConnected();

    try {
      const menu = this.client.menu('/ip/hotspot/active');
      await menu.remove(sessionId);
      this.logger.log(`✅ Disconnected user session: ${sessionId}`);
    } catch (error) {
      this.logger.error(`❌ Failed to disconnect user: ${error.message}`);
      throw new Error(`Failed to disconnect user: ${error.message}`);
    }
  }

  /**
   * Désactiver un utilisateur
   */
  async disableUser(username: string): Promise<void> {
    this.ensureConnected();

    try {
      const menu = this.client.menu('/ip/hotspot/user');
      const users = await menu.query({ name: username }).find();
      
      if (users.length === 0) {
        throw new Error(`User ${username} not found`);
      }

      await menu.set(users[0].id, { disabled: true });
      this.logger.log(`✅ Disabled user: ${username}`);
    } catch (error) {
      this.logger.error(`❌ Failed to disable user ${username}: ${error.message}`);
      throw new Error(`Failed to disable user: ${error.message}`);
    }
  }

  /**
   * Activer un utilisateur
   */
  async enableUser(username: string): Promise<void> {
    this.ensureConnected();

    try {
      const menu = this.client.menu('/ip/hotspot/user');
      const users = await menu.query({ name: username }).find();
      
      if (users.length === 0) {
        throw new Error(`User ${username} not found`);
      }

      await menu.set(users[0].id, { disabled: false });
      this.logger.log(`✅ Enabled user: ${username}`);
    } catch (error) {
      this.logger.error(`❌ Failed to enable user ${username}: ${error.message}`);
      throw new Error(`Failed to enable user: ${error.message}`);
    }
  }

  /**
   * Vérifier la connexion
   */
  async checkConnection(): Promise<boolean> {
    try {
      if (!this.connected) {
        await this.connect();
      }
      return this.connected;
    } catch (error) {
      return false;
    }
  }
}

