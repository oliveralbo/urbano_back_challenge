export class ProductUpdatedEvent {
  constructor(
    public readonly productId: number,
    public readonly merchantId: number,
    public readonly title: string,
  ) {}
}
