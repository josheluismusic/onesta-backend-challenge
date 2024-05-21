import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'clients',
})
export class ClientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ unique: true })
    email: string;
}
