import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { FruitEntity } from './fruit.entity';
import { HarvestEntity } from './harvest.entity';

@Entity({
    name: 'fruit_varieties',
})
export class VarietyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => FruitEntity, (fruit) => fruit.varieties)
    fruit: FruitEntity;

    @OneToMany(() => HarvestEntity, (harvest) => harvest.variety)
    harvests: HarvestEntity[];

    @Column({ unique: true })
    uniqueKey: string;
}
