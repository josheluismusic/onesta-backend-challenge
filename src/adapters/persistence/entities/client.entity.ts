import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HarvestEntity } from './harvest.entity';

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

    @OneToMany(() => HarvestEntity, (harvest) => harvest.client)
    harvests: HarvestEntity[];
}
