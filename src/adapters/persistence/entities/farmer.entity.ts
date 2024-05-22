import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FieldEntity } from './filed.entity';

@Entity({
    name: 'farmers',
})
export class FarmerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(() => FieldEntity, (field) => field.farmer)
    fields: FieldEntity[];
}
