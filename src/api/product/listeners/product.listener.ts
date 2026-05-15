import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductService } from '../services/product.service';
import { ProductCreatedEvent } from '../events/product-created.event';
import { ProductActivatedEvent } from '../events/product-activated.event';
import { RoleUnassignedEvent } from '../../role/events/role-unassigned.event';
import { Roles } from '../../role/enum/role.enum';

@Injectable()
export class ProductListener {
  private readonly logger = new Logger(ProductListener.name);

  constructor(private readonly productService: ProductService) {}

  @OnEvent('product.created')
  async handleProductCreatedEvent(event: ProductCreatedEvent) {
    this.logger.log(
      `Nuevo producto creado: "${event.title}" (ID: ${event.productId}). Iniciando auto-activación...`,
    );

    try {
      await this.productService.activateProduct(
        event.productId,
        event.merchantId,
      );
    } catch (error) {
      this.logger.warn(
        `No se pudo activar automáticamente el producto ${event.productId}: ${error}`,
      );
    }
  }

  @OnEvent('product.activated')
  handleProductActivatedEvent(event: ProductActivatedEvent) {
    this.logger.log(
      `Producto activado exitosamente: "${event.title}" (ID: ${event.productId}).`,
    );
  }

  @OnEvent('role.unassigned')
  async handleRoleUnassignedEvent(event: RoleUnassignedEvent) {
    if (event.roleName === Roles.Merchant) {
      this.logger.log(
        `[ProductListener] Removiendo productos del mercante (ID: ${event.userId}) porque su rol fue revocado.`,
      );
      await this.productService.deleteProductsByMerchant(event.userId);
    }
  }
}
