declare class OrderItemDto {
    serviceId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    address?: string;
    scheduleDate?: string;
    explanation?: string;
    items: OrderItemDto[];
}
export {};
