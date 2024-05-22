import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { FarmerEntity } from './farmer.entity';

@Entity({
    name: 'fields',
})
@Unique(['name', 'location'])
export class FieldEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => FarmerEntity, (farmer) => farmer.fields)
    farmer: FarmerEntity;

    @Column()
    name: string;

    @Column()
    location: string;
}
