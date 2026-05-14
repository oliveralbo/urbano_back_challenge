export class RoleAssignedEvent {
  constructor(
    public readonly userId: number,
    public readonly userEmail: string,
    public readonly roleId: number,
    public readonly roleName: string,
  ) {}
}
