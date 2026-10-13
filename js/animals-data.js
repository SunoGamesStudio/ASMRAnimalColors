// ASMR Animal Colors - Database of Categories and Animals
// Cleaned, optimized, and spaced according to anti-repetition rules.
export const CATEGORIES = [
  {
    id: 'jungle',
    name: 'Jungle Animals',
    shortName: 'Jungle',
    title: 'Wild Jungle Animals',
    emoji: '🦁',
    icon: 'Categories/Lion.svg',
    circleBg: '#f59e0b',
    color: '#d97706',
    bg: '#fffbeb',
    animals: [
      { id: 'lion_04', name: 'Safari Lion', file: 'Lion_04.svg', path: 'Animals/Jungle/Lion_04.svg' },
      { id: 'baby_elephant', name: 'Baby Elephant', file: 'baby_elephant.svg', path: 'Animals/Jungle/baby_elephant.svg' },
      { id: 'giraffe', name: 'Tall Giraffe', file: 'Giraffe.svg', path: 'Animals/Jungle/Giraffe.svg' },
      { id: 'striped_zebra', name: 'Striped Zebra', file: 'zebra.svg', path: 'Animals/Jungle/zebra.svg' },
      { id: 'panda', name: 'Panda', file: 'Panda.svg', path: 'Animals/Jungle/Panda.svg' },
      { id: 'baby_monkey', name: 'Baby Monkey', file: 'baby_monkey.svg', path: 'Animals/Jungle/baby_monkey.svg' },
      { id: 'brown_bear', name: 'Brown Bear', file: 'bear.svg', path: 'Animals/Jungle/bear.svg' },
      { id: 'hippo', name: 'Baby Hippo', file: 'hippo.svg', path: 'Animals/Jungle/hippo.svg' },
      { id: 'baby_rhino', name: 'Baby Rhino', file: 'baby_rhino.svg', path: 'Animals/Jungle/baby_rhino.svg' },
      { id: 'kangaroo', name: 'Kangaroo', file: 'kangaroo.svg', path: 'Animals/Jungle/kangaroo.svg' },
      { id: 'koala', name: 'Koala', file: 'Koala.svg', path: 'Animals/Jungle/Koala.svg' },
      { id: 'lion_cub', name: 'Lion Cub', file: 'Lion_Cub.svg', path: 'Animals/Jungle/Lion_Cub.svg' },
      { id: 'tiger_02', name: 'Wild Tiger', file: 'Tiger_02.svg', path: 'Animals/Jungle/Tiger_02.svg' },
      { id: 'baby_deer', name: 'Baby Fawn', file: 'baby_deer.svg', path: 'Animals/Jungle/baby_deer.svg' },
      { id: 'gorilla_01', name: 'Mighty Gorilla', file: 'Gorilla_01.svg', path: 'Animals/Jungle/Gorilla_01.svg' },
      { id: 'acorn_squirrel', name: 'Acorn Squirrel', file: 'squirrel.svg', path: 'Animals/Jungle/squirrel.svg' },
      { id: 'panda_cub', name: 'Panda Cub', file: 'panda_cub.svg', path: 'Animals/Jungle/panda_cub.svg' },
      { id: 'zebra_foal', name: 'Zebra Foal', file: 'zebra_foal.svg', path: 'Animals/Jungle/zebra_foal.svg' },
      { id: 'red_panda', name: 'Red Panda', file: 'Red_Panda.svg', path: 'Animals/Jungle/Red_Panda.svg' },
      { id: 'fox', name: 'Fox', file: 'Fox.svg', path: 'Animals/Jungle/Fox.svg' },
      { id: 'sloth', name: 'Sloth', file: 'Sloth.svg', path: 'Animals/Jungle/Sloth.svg' },
      { id: 'hedgehog_01', name: 'Hedgehog', file: 'Hedgehog_01.svg', path: 'Animals/Jungle/Hedgehog_01.svg' },
      { id: 'meerkat_curious', name: 'Curious Meerkat', file: 'meerkat.svg', path: 'Animals/Jungle/meerkat.svg' },
      { id: 'gentle_bear', name: 'Gentle Bear', file: 'bear_01.svg', path: 'Animals/Jungle/bear_01.svg' },
      { id: 'elephant_03', name: 'Grand Elephant', file: 'Elephant_03.svg', path: 'Animals/Jungle/Elephant_03.svg' },
      { id: 'monkey_01', name: 'Jungle Monkey', file: 'Monkey_01.svg', path: 'Animals/Jungle/Monkey_01.svg' },
      { id: 'rhino_gentle', name: 'Rhino', file: 'rhino.svg', path: 'Animals/Jungle/rhino.svg' },
      { id: 'prairie_bison', name: 'Prairie Bison', file: 'bison.svg', path: 'Animals/Jungle/bison.svg' },
      { id: 'woodland_moose', name: 'Woodland Moose', file: 'moose.svg', path: 'Animals/Jungle/moose.svg' },
      { id: 'smiling_quokka', name: 'Smiling Quokka', file: 'quokka.svg', path: 'Animals/Jungle/quokka.svg' },
      { id: 'chimpanzee', name: 'Playful Chimp', file: 'Chimpanzee.svg', path: 'Animals/Jungle/Chimpanzee.svg' },
      { id: 'chimpanzee_01', name: 'Little Chimpanzee', file: 'Chimpanzee_01.svg', path: 'Animals/Jungle/Chimpanzee_01.svg' },
      { id: 'polar_bear', name: 'Polar Bear', file: 'Polar_Bear.svg', path: 'Animals/Jungle/Polar_Bear.svg' },
      { id: 'chipmunk', name: 'Chipmunk', file: 'Chipmunk.svg', path: 'Animals/Jungle/Chipmunk.svg' },
      { id: 'chinchilla_01', name: 'Chinchilla', file: 'Chinchilla_01.svg', path: 'Animals/Jungle/Chinchilla_01.svg' },
      { id: 'raccoon', name: 'Raccoon', file: 'Raccoon.svg', path: 'Animals/Jungle/Raccoon.svg' },
      { id: 'fennec_fox', name: 'Fennec Fox', file: 'Fennec_Fox.svg', path: 'Animals/Jungle/Fennec_Fox.svg' },
      { id: 'leopard', name: 'Leopard', file: 'Leopard.svg', path: 'Animals/Jungle/Leopard.svg' },
      { id: 'black_panther', name: 'Black Panther', file: 'Black_Panther.svg', path: 'Animals/Jungle/Black_Panther.svg' },
      { id: 'lion_03', name: 'Mighty Lion', file: 'Lion_03.svg', path: 'Animals/Jungle/Lion_03.svg' },
      { id: 'giraffe_01', name: 'Sweet Giraffe', file: 'Giraffe_01.svg', path: 'Animals/Jungle/Giraffe_01.svg' },
      { id: 'moose_02', name: 'Forest Moose', file: 'Moose_02.svg', path: 'Animals/Jungle/Moose_02.svg' },
      { id: 'crocodile', name: 'River Crocodile', file: 'Crocodile.svg', path: 'Animals/Jungle/Crocodile.svg' },
      { id: 'crocodile_01', name: 'Snappy Crocodile', file: 'Crocodile_01.svg', path: 'Animals/Jungle/Crocodile_01.svg' },
      { id: 'chameleon_01', name: 'Chameleon', file: 'Chameleon_01.svg', path: 'Animals/Jungle/Chameleon_01.svg' },
      { id: 'gecko', name: 'Gecko', file: 'Gecko.svg', path: 'Animals/Jungle/Gecko.svg' },
      { id: 'iguana', name: 'Iguana', file: 'Iguana.svg', path: 'Animals/Jungle/Iguana.svg' },
      { id: 'beaver', name: 'Beaver', file: 'Beaver.svg', path: 'Animals/Jungle/Beaver.svg' },
      { id: 'badger', name: 'Badger', file: 'Badger.svg', path: 'Animals/Jungle/Badger.svg' },
      { id: 'sugar_glider', name: 'Sugar Glider', file: 'sugar_glider.svg', path: 'Animals/Jungle/sugar_glider.svg' },
      { id: 'tree_kangaroo', name: 'Tree Kangaroo', file: 'tree_kangaroo.svg', path: 'Animals/Jungle/tree_kangaroo.svg' },
      { id: 'platypus', name: 'Platypus', file: 'Platypus.svg', path: 'Animals/Jungle/Platypus.svg' },
      { id: 'wombat', name: 'Wombat', file: 'Wombat.svg', path: 'Animals/Jungle/Wombat.svg' },
      { id: 'armadillo', name: 'Armadillo', file: 'Armadillo.svg', path: 'Animals/Jungle/Armadillo.svg' },
      { id: 'porcupine', name: 'Porcupine', file: 'Porcupine.svg', path: 'Animals/Jungle/Porcupine.svg' },
      { id: 'capuchin_monkey', name: 'Capuchin Monkey', file: 'capuchin_monkey.svg', path: 'Animals/Jungle/capuchin_monkey.svg' },
      { id: 'spider_monkey', name: 'Spider Monkey', file: 'spider_monkey.svg', path: 'Animals/Jungle/spider_monkey.svg' },
      { id: 'lemur', name: 'Lemur', file: 'Lemur.svg', path: 'Animals/Jungle/Lemur.svg' },
      { id: 'ring_tailed_lemur', name: 'Ring-Tailed Lemur', file: 'Ring-Tailed_Lemur.svg', path: 'Animals/Jungle/Ring-Tailed_Lemur.svg' },
      { id: 'golden_lion_tamarin', name: 'Golden Lion Tamarin', file: 'Golden_Lion_Tamarin.svg', path: 'Animals/Jungle/Golden_Lion_Tamarin.svg' },
      { id: 'slow_loris', name: 'Slow Loris', file: 'Slow_Loris.svg', path: 'Animals/Jungle/Slow_Loris.svg' },
      { id: 'arctic_fox', name: 'Arctic Fox', file: 'Arctic_Fox.svg', path: 'Animals/Jungle/Arctic_Fox.svg' },
      { id: 'gazelle', name: 'Gazelle', file: 'Gazelle.svg', path: 'Animals/Jungle/Gazelle.svg' },
      { id: 'dik_dik', name: 'Dik-Dik', file: 'dik_dik.svg', path: 'Animals/Jungle/dik_dik.svg' },
      { id: 'okapi', name: 'Okapi', file: 'okapi.svg', path: 'Animals/Jungle/okapi.svg' },
      { id: 'vicuna', name: 'Vicuña', file: 'vicuna.svg', path: 'Animals/Jungle/vicuna.svg' },
      { id: 'baby_tapir', name: 'Baby Tapir', file: 'tapir.svg', path: 'Animals/Jungle/tapir.svg' },
      { id: 'kinkajou', name: 'Kinkajou', file: 'kinkajou.svg', path: 'Animals/Jungle/kinkajou.svg' },
      { id: 'coatimundi', name: 'Coatimundi', file: 'coatimundi.svg', path: 'Animals/Jungle/coatimundi.svg' },
      { id: 'patagonian_mara', name: 'Patagonian Mara', file: 'mara.svg', path: 'Animals/Jungle/mara.svg' },
      { id: 'spotted_paca', name: 'Spotted Paca', file: 'paca.svg', path: 'Animals/Jungle/paca.svg' },
      { id: 'agouti', name: 'Agouti', file: 'agouti.svg', path: 'Animals/Jungle/agouti.svg' },
      { id: 'spotted_cuscus', name: 'Spotted Cuscus', file: 'spotted_cuscus.svg', path: 'Animals/Jungle/spotted_cuscus.svg' },
      { id: 'langur', name: 'Langur Monkey', file: 'Langur.svg', path: 'Animals/Jungle/Langur.svg' },
      { id: 'baboon_01', name: 'Playful Baboon', file: 'Baboon_01.svg', path: 'Animals/Jungle/Baboon_01.svg' },
      { id: 'proboscis_monkey', name: 'Proboscis Monkey', file: 'proboscis.svg', path: 'Animals/Jungle/proboscis.svg' },
      { id: 'uakari_monkey', name: 'Uakari Monkey', file: 'Uakari_Monkey.svg', path: 'Animals/Jungle/Uakari_Monkey.svg' },
      { id: 'camel_jungle', name: 'Desert Camel', file: 'Camel_01.svg', path: 'Animals/Jungle/Camel_01.svg' },
      { id: 'opossum', name: 'Opossum', file: 'Opossum.svg', path: 'Animals/Jungle/Opossum.svg' },
      { id: 'opossum_01', name: 'Little Opossum', file: 'Opossum_01.svg', path: 'Animals/Jungle/Opossum_01.svg' },
      { id: 'skunk_01', name: 'Skunk', file: 'Skunk_01.svg', path: 'Animals/Jungle/Skunk_01.svg' },
      { id: 'fruit_bat_01', name: 'Cute Bat', file: 'Fruit_Bat_01.svg', path: 'Animals/Jungle/Fruit_Bat_01.svg' },
      { id: 'frilled_neck_lizard', name: 'Frilled-Neck Lizard', file: 'Frilled-Neck_Lizard.svg', path: 'Animals/Jungle/Frilled-Neck_Lizard.svg' },
      { id: 'pangolin', name: 'Pangolin', file: 'Pangolin.svg', path: 'Animals/Jungle/Pangolin.svg' },
      { id: 'tamandua', name: 'Tamandua', file: 'tamandua.svg', path: 'Animals/Jungle/tamandua.svg' },
      { id: 'honey_badger', name: 'Honey Badger', file: 'Honey_Badger.svg', path: 'Animals/Jungle/Honey_Badger.svg' },
      { id: 'wolf_01', name: 'Timber Wolf', file: 'Wolf_01.svg', path: 'Animals/Jungle/Wolf_01.svg' },
      { id: 'hyena_01', name: 'Laughing Hyena', file: 'Hyena_01.svg', path: 'Animals/Jungle/Hyena_01.svg' },
      { id: 'binturong', name: 'Binturong', file: 'binturong.svg', path: 'Animals/Jungle/binturong.svg' },
      { id: 'colugo', name: 'Colugo', file: 'colugo.svg', path: 'Animals/Jungle/colugo.svg' },
      { id: 'guanaco', name: 'Guanaco', file: 'Guanaco.svg', path: 'Animals/Jungle/Guanaco.svg' },
      { id: 'fossa', name: 'Fossa', file: 'Fossa.svg', path: 'Animals/Jungle/Fossa.svg' },
      { id: 'tasmanian_devil', name: 'Tasmanian Devil', file: 'Tasmanian_Devil.svg', path: 'Animals/Jungle/Tasmanian_Devil.svg' },
      { id: 'komodo_dragon', name: 'Komodo Dragon', file: 'Komodo_Dragon.svg', path: 'Animals/Jungle/Komodo_Dragon.svg' },
      { id: 'zorilla', name: 'Zorilla', file: 'Zorilla.svg', path: 'Animals/Jungle/Zorilla.svg' },
      { id: 'aye_aye', name: 'Aye-Aye', file: 'Aye-Aye.svg', path: 'Animals/Jungle/Aye-Aye.svg' },
      { id: 'aardvark', name: 'Aardvark', file: 'Aardvark.svg', path: 'Animals/Jungle/Aardvark.svg' },
    ]
  },
  {
    id: 'farm',
    name: 'Farm Animals',
    shortName: 'Farm',
    title: 'Cute Farm Animals',
    emoji: '🐑',
    icon: 'Categories/Sheep_01.svg',
    circleBg: '#10b981',
    color: '#059669',
    bg: '#f0fdf4',
    animals: [
      { id: 'dairy_cow', name: 'Dairy Cow', file: 'cow.svg', path: 'Animals/Farm/cow.svg' },
      { id: 'fluffy_sheep', name: 'Fluffy Sheep', file: 'sheep.svg', path: 'Animals/Farm/sheep.svg' },
      { id: 'playful_kitten', name: 'Playful Kitten', file: 'kitten.svg', path: 'Animals/Farm/kitten.svg' },
      { id: 'horse', name: 'Horse', file: 'horse.svg', path: 'Animals/Farm/horse.svg' },
      { id: 'pig', name: 'Pig', file: 'Pig.svg', path: 'Animals/Farm/Pig.svg' },
      { id: 'golden_retriever_farm', name: 'Golden Retriever', file: 'Golden_Retriever.svg', path: 'Animals/Farm/Golden_Retriever.svg' },
      { id: 'bunny', name: 'Cottontail Bunny', file: 'Bunny.svg', path: 'Animals/Farm/Bunny.svg' },
      { id: 'duckling', name: 'Little Duckling', file: 'Duckling.svg', path: 'Animals/Farm/Duckling.svg' },
      { id: 'farm_hen', name: 'Farm Hen', file: 'hen.svg', path: 'Animals/Farm/hen.svg' },
      { id: 'cheerful_rooster', name: 'Cheerful Rooster', file: 'rooster.svg', path: 'Animals/Farm/rooster.svg' },
      { id: 'calf', name: 'Calf', file: 'Calf.svg', path: 'Animals/Farm/Calf.svg' },
      { id: 'spring_lamb', name: 'Spring Lamb', file: 'spring_lamb.svg', path: 'Animals/Farm/spring_lamb.svg' },
      { id: 'foal', name: 'Foal', file: 'Foal.svg', path: 'Animals/Farm/Foal.svg' },
      { id: 'munchkin_kitten', name: 'Munchkin Cat', file: 'munchkin_kitten.svg', path: 'Animals/Farm/munchkin_kitten.svg' },
      { id: 'shetland_pony', name: 'Shetland Pony', file: 'shetland_pony.svg', path: 'Animals/Farm/shetland_pony.svg' },
      { id: 'corgi', name: 'Corgi', file: 'corgi.svg', path: 'Animals/Farm/corgi.svg' },
      { id: 'chick', name: 'Chick', file: 'Chick.svg', path: 'Animals/Farm/Chick.svg' },
      { id: 'alpaca', name: 'Alpaca', file: 'Alpaca.svg', path: 'Animals/Farm/Alpaca.svg' },
      { id: 'donkey', name: 'Donkey', file: 'Donkey.svg', path: 'Animals/Farm/Donkey.svg' },
      { id: 'goat_01', name: 'Goat', file: 'Goat_01.svg', path: 'Animals/Farm/Goat_01.svg' },
      { id: 'persian_cat', name: 'Persian Cat', file: 'persian_cat.svg', path: 'Animals/Farm/persian_cat.svg' },
      { id: 'dalmatian', name: 'Dalmatian', file: 'Dalmatian.svg', path: 'Animals/Farm/Dalmatian.svg' },
      { id: 'hamster', name: 'Hamster', file: 'Hamster.svg', path: 'Animals/Farm/Hamster.svg' },
      { id: 'buffalo', name: 'Water Buffalo', file: 'buffalo.svg', path: 'Animals/Farm/buffalo.svg' },
      { id: 'siamese_cat', name: 'Siamese Cat', file: 'siamese_cat.svg', path: 'Animals/Farm/siamese_cat.svg' },
      { id: 'dog_poodle', name: 'Poodle', file: 'Dog_-_Poodle.svg', path: 'Animals/Farm/Dog_-_Poodle.svg' },
      { id: 'guinea_pig', name: 'Guinea Pig', file: 'Guinea_Pig.svg', path: 'Animals/Farm/Guinea_Pig.svg' },
      { id: 'tuxedo_cat', name: 'Tuxedo Cat', file: 'tuxedo_cat.svg', path: 'Animals/Farm/tuxedo_cat.svg' },
      { id: 'dog_dachshund', name: 'Dachshund', file: 'Dog_-_Dachshund.svg', path: 'Animals/Farm/Dog_-_Dachshund.svg' },
      { id: 'rabbit', name: 'White Rabbit', file: 'Rabbit.svg', path: 'Animals/Farm/Rabbit.svg' },
      { id: 'beagle', name: 'Beagle', file: 'beagle.svg', path: 'Animals/Farm/beagle.svg' },
      { id: 'llama', name: 'Llama', file: 'Llama.svg', path: 'Animals/Farm/Llama.svg' },
      { id: 'pot_bellied_pig', name: 'Pot-Bellied Pig', file: 'pot_bellied_pig.svg', path: 'Animals/Farm/pot_bellied_pig.svg' },
      { id: 'french_bulldog', name: 'French Bulldog', file: 'french_bulldog.svg', path: 'Animals/Farm/french_bulldog.svg' },
      { id: 'highland_cow', name: 'Highland Cow', file: 'highland_cow.svg', path: 'Animals/Farm/highland_cow.svg' },
      { id: 'pug', name: 'Pug', file: 'pug.svg', path: 'Animals/Farm/pug.svg' },
      { id: 'turkey', name: 'Turkey', file: 'Turkey.svg', path: 'Animals/Farm/Turkey.svg' },
      { id: 'pomeranian', name: 'Pomeranian', file: 'pomeranian.svg', path: 'Animals/Farm/pomeranian.svg' },
      { id: 'angora_rabbit', name: 'Angora Rabbit', file: 'angora_rabbit.svg', path: 'Animals/Farm/angora_rabbit.svg' },
      { id: 'saint_bernard', name: 'Saint Bernard', file: 'Saint_Bernard.svg', path: 'Animals/Farm/Saint_Bernard.svg' },
      { id: 'camel', name: 'Camel', file: 'camel.svg', path: 'Animals/Farm/camel.svg' },
      { id: 'collie', name: 'Farm Collie', file: 'Collie.svg', path: 'Animals/Farm/Collie.svg' },
      { id: 'lop_rabbit', name: 'Lop Rabbit', file: 'lop_rabbit.svg', path: 'Animals/Farm/lop_rabbit.svg' },
      { id: 'chihuahua', name: 'Chihuahua', file: 'chihuahua.svg', path: 'Animals/Farm/chihuahua.svg' },
      { id: 'bantam_chicken', name: 'Silkie Bantam', file: 'bantam_chicken.svg', path: 'Animals/Farm/bantam_chicken.svg' },
      { id: 'gentle_ox', name: 'Gentle Ox', file: 'ox.svg', path: 'Animals/Farm/ox.svg' },
      { id: 'basset_hound', name: 'Basset Hound', file: 'basset_hound.svg', path: 'Animals/Farm/basset_hound.svg' },
      { id: 'mouse', name: 'Mouse', file: 'Mouse.svg', path: 'Animals/Farm/Mouse.svg' },
      { id: 'bulldog', name: 'Bulldog', file: 'Bulldog.svg', path: 'Animals/Farm/Bulldog.svg' },
      { id: 'dog_shihtzu', name: 'Shih Tzu', file: 'Dog_-_Shih_Tzu.svg', path: 'Animals/Farm/Dog_-_Shih_Tzu.svg' },
      { id: 'dog_yorkie', name: 'Yorkshire Terrier', file: 'Dog_-_Yorkshire_Terrier.svg', path: 'Animals/Farm/Dog_-_Yorkshire_Terrier.svg' },
      { id: 'siberian_husky', name: 'Siberian Husky', file: 'Siberian_Husky.svg', path: 'Animals/Farm/Siberian_Husky.svg' },
      { id: 'farm_goose', name: 'Farm Goose', file: 'farm_goose.svg', path: 'Animals/Farm/farm_goose.svg' },
      { id: 'rooster_01', name: 'Sunrise Rooster', file: 'Rooster_01.svg', path: 'Animals/Farm/Rooster_01.svg' },
      { id: 'golden_retriever_01', name: 'Playful Retriever', file: 'Golden_Retriever_01.svg', path: 'Animals/Farm/Golden_Retriever_01.svg' },
      { id: 'parakeet', name: 'Parakeet', file: 'Parakeet.svg', path: 'Animals/Farm/Parakeet.svg' },
      { id: 'barn_owl', name: 'Barn Owl', file: 'Barn_Owl.svg', path: 'Animals/Farm/Barn_Owl.svg' },
      { id: 'zebu_calf', name: 'Zebu Calf', file: 'zebu_calf.svg', path: 'Animals/Farm/zebu_calf.svg' },
      { id: 'squirrel_farm', name: 'Squirrel', file: 'Squirrel.svg', path: 'Animals/Farm/Squirrel.svg' },
      { id: 'ferret', name: 'Pet Ferret', file: 'ferret.svg', path: 'Animals/Farm/ferret.svg' },
      { id: 'chinchilla_pet', name: 'Pet Chinchilla', file: 'chinchilla.svg', path: 'Animals/Farm/chinchilla.svg' },
      { id: 'hedgehog_pet', name: 'Pet Hedgehog', file: 'hedgehog.svg', path: 'Animals/Farm/hedgehog.svg' },
      { id: 'mule', name: 'Mule', file: 'mule.svg', path: 'Animals/Farm/mule.svg' },
      { id: 'shaggy_yak', name: 'Shaggy Yak', file: 'yak.svg', path: 'Animals/Farm/yak.svg' },
    ]
  },
  {
    id: 'aquatic',
    name: 'Aquatic Animals',
    shortName: 'Aquatic',
    title: 'Ocean & Sea Life',
    emoji: '🦀',
    icon: 'Categories/Crab.svg',
    circleBg: '#06b6d4',
    color: '#0891b2',
    bg: '#ecfeff',
    animals: [
      { id: 'dolphin', name: 'Dolphin', file: 'Dolphin.svg', path: 'Animals/Aquatic/Dolphin.svg' },
      { id: 'clownfish', name: 'Clown Fish', file: 'Clownfish.svg', path: 'Animals/Aquatic/Clownfish.svg' },
      { id: 'sea_turtle', name: 'Sea Turtle', file: 'Sea_Turtle.svg', path: 'Animals/Aquatic/Sea_Turtle.svg' },
      { id: 'harp_seal', name: 'Harp Seal Pup', file: 'seal.svg', path: 'Animals/Aquatic/seal.svg' },
      { id: 'penguin', name: 'Penguin', file: 'Penguin.svg', path: 'Animals/Aquatic/Penguin.svg' },
      { id: 'starfish', name: 'Starfish', file: 'Starfish_01.svg', path: 'Animals/Aquatic/Starfish_01.svg' },
      { id: 'seahorse', name: 'Seahorse', file: 'Seahorse.svg', path: 'Animals/Aquatic/Seahorse.svg' },
      { id: 'goldfish', name: 'Goldfish', file: 'Goldfish.svg', path: 'Animals/Aquatic/Goldfish.svg' },
      { id: 'blue_whale', name: 'Blue Whale', file: 'Blue_Whale.svg', path: 'Animals/Aquatic/Blue_Whale.svg' },
      { id: 'sea_otter', name: 'Sea Otter', file: 'Sea_Otter.svg', path: 'Animals/Aquatic/Sea_Otter.svg' },
      { id: 'octopus', name: 'Octopus', file: 'Octopus.svg', path: 'Animals/Aquatic/Octopus.svg' },
      { id: 'crab_01', name: 'Little Beach Crab', file: 'Crab_01.svg', path: 'Animals/Aquatic/Crab_01.svg' },
      { id: 'beluga_whale', name: 'Beluga Whale', file: 'Beluga_Whale.svg', path: 'Animals/Aquatic/Beluga_Whale.svg' },
      { id: 'narwhal', name: 'Narwhal', file: 'Narwhal.svg', path: 'Animals/Aquatic/Narwhal.svg' },
      { id: 'jellyfish', name: 'Jellyfish', file: 'Jellyfish.svg', path: 'Animals/Aquatic/Jellyfish.svg' },
      { id: 'axolotl', name: 'Axolotl', file: 'Axolotl.svg', path: 'Animals/Aquatic/Axolotl.svg' },
      { id: 'capybara', name: 'Capybara', file: 'Capybara.svg', path: 'Animals/Aquatic/Capybara.svg' },
      { id: 'manatee', name: 'Manatee', file: 'Manatee.svg', path: 'Animals/Aquatic/Manatee.svg' },
      { id: 'hermit_crab', name: 'Hermit Crab', file: 'Hermit_Crab.svg', path: 'Animals/Aquatic/Hermit_Crab.svg' },
      { id: 'otter', name: 'Otter', file: 'Otter.svg', path: 'Animals/Aquatic/Otter.svg' },
      { id: 'flying_fish', name: 'Flying Fish', file: 'Flying_Fish.svg', path: 'Animals/Aquatic/Flying_Fish.svg' },
      { id: 'angelfish', name: 'Angel Fish', file: 'AngelFish.svg', path: 'Animals/Aquatic/AngelFish.svg' },
      { id: 'butterflyfish', name: 'Butterfly Fish', file: 'ButterflyFish.svg', path: 'Animals/Aquatic/ButterflyFish.svg' },
      { id: 'sealion', name: 'Sea Lion', file: 'SeaLion.svg', path: 'Animals/Aquatic/SeaLion.svg' },
      { id: 'angelfish_01', name: 'Striped Angelfish', file: 'AngelFish_01.svg', path: 'Animals/Aquatic/AngelFish_01.svg' },
      { id: 'butterflyfish_01', name: 'Coral Butterflyfish', file: 'ButterflyFish_01.svg', path: 'Animals/Aquatic/ButterflyFish_01.svg' },
      { id: 'shrimp', name: 'Pink Shrimp', file: 'Shrimp.svg', path: 'Animals/Aquatic/Shrimp.svg' },
      { id: 'shrimp_01', name: 'Ocean Shrimp', file: 'Shrimp_01.svg', path: 'Animals/Aquatic/Shrimp_01.svg' },
      { id: 'lobster', name: 'Red Lobster', file: 'Lobster.svg', path: 'Animals/Aquatic/Lobster.svg' },
      { id: 'lobster_01', name: 'Spiny Lobster', file: 'Lobster_01.svg', path: 'Animals/Aquatic/Lobster_01.svg' },
      { id: 'crab', name: 'Ocean Crab', file: 'Crab.svg', path: 'Animals/Aquatic/Crab.svg' },
      { id: 'mantaray', name: 'Manta Ray', file: 'Mantaray.svg', path: 'Animals/Aquatic/Mantaray.svg' },
      { id: 'manta_ray_01', name: 'Giant Manta Ray', file: 'Manta_Ray_01.svg', path: 'Animals/Aquatic/Manta_Ray_01.svg' },
      { id: 'leafy_sea_dragon', name: 'Leafy Sea Dragon', file: 'Leafy_Sea_Dragon.svg', path: 'Animals/Aquatic/Leafy_Sea_Dragon.svg' },
      { id: 'walrus', name: 'Walrus', file: 'Walrus.svg', path: 'Animals/Aquatic/Walrus.svg' },
      { id: 'orca_whale', name: 'Orca Whale', file: 'Orca_Whale.svg', path: 'Animals/Aquatic/Orca_Whale.svg' },
      { id: 'conchshell', name: 'Conch Shell', file: 'Conchshell.svg', path: 'Animals/Aquatic/Conchshell.svg' },
      { id: 'scallopshell', name: 'Scallop Shell', file: 'Scallopshell.svg', path: 'Animals/Aquatic/Scallopshell.svg' },
      { id: 'nautilusshell', name: 'Nautilus Shell', file: 'NautilusShell.svg', path: 'Animals/Aquatic/NautilusShell.svg' },
      { id: 'frog_01', name: 'Tree Frog', file: 'Frog_01.svg', path: 'Animals/Aquatic/Frog_01.svg' },
      { id: 'swordfish', name: 'Swordfish', file: 'Swordfish.svg', path: 'Animals/Aquatic/Swordfish.svg' },
      { id: 'stingray', name: 'Stingray', file: 'Stingray.svg', path: 'Animals/Aquatic/Stingray.svg' },
      { id: 'cuttlefish', name: 'Cuttlefish', file: 'Cuttlefish.svg', path: 'Animals/Aquatic/Cuttlefish.svg' },
      { id: 'lionfish', name: 'Lionfish', file: 'Lionfish.svg', path: 'Animals/Aquatic/Lionfish.svg' },
      { id: 'shark', name: 'Shark', file: 'Shark.svg', path: 'Animals/Aquatic/Shark.svg' },
      { id: 'largetooth_sawfish', name: 'Largetooth Sawfish', file: 'Largetooth_Sawfish.svg', path: 'Animals/Aquatic/Largetooth_Sawfish.svg' },
      { id: 'gharial', name: 'Gharial', file: 'Gharial.svg', path: 'Animals/Aquatic/Gharial.svg' },
      { id: 'blobfish', name: 'Blobfish', file: 'Blobfish.svg', path: 'Animals/Aquatic/Blobfish.svg' },
    ]
  },
  {
    id: 'birds',
    name: 'Birds',
    shortName: 'Birds',
    title: 'Beautiful Birds',
    emoji: '🦉',
    icon: 'Categories/Owl_01.webp',
    circleBg: '#3b82f6',
    color: '#2563eb',
    bg: '#eff6ff',
    animals: [
      { id: 'parrot', name: 'Parrot', file: 'parrot.svg', path: 'Animals/Birds/parrot.svg' },
      { id: 'flamingo', name: 'Flamingo', file: 'Flamingo.svg', path: 'Animals/Birds/Flamingo.svg' },
      { id: 'toucan', name: 'Toucan', file: 'Toucan.svg', path: 'Animals/Birds/Toucan.svg' },
      { id: 'owl', name: 'Wise Owl', file: 'Owl.svg', path: 'Animals/Birds/Owl.svg' },
      { id: 'peacock_01', name: 'Royal Peacock', file: 'Peacock_01.svg', path: 'Animals/Birds/Peacock_01.svg' },
      { id: 'duck', name: 'Quacking Duck', file: 'Duck.svg', path: 'Animals/Birds/Duck.svg' },
      { id: 'king_penguin', name: 'King Penguin', file: 'King_Penguin.svg', path: 'Animals/Birds/King_Penguin.svg' },
      { id: 'swan', name: 'Swan', file: 'Swan.svg', path: 'Animals/Birds/Swan.svg' },
      { id: 'hummingbird', name: 'Hummingbird', file: 'Hummingbird.svg', path: 'Animals/Birds/Hummingbird.svg' },
      { id: 'cockatiel', name: 'Cockatiel', file: 'Cockatiel.svg', path: 'Animals/Birds/Cockatiel.svg' },
      { id: 'european_robin', name: 'European Robin', file: 'european_robin.svg', path: 'Animals/Birds/european_robin.svg' },
      { id: 'bluebird', name: 'Bluebird', file: 'bluebird.svg', path: 'Animals/Birds/bluebird.svg' },
      { id: 'atlantic_puffin', name: 'Atlantic Puffin', file: 'Atlantic_Puffin.svg', path: 'Animals/Birds/Atlantic_Puffin.svg' },
      { id: 'woodpecker', name: 'Tapping Woodpecker', file: 'woodpecker.svg', path: 'Animals/Birds/woodpecker.svg' },
      { id: 'canary', name: 'Canary', file: 'Canary.svg', path: 'Animals/Birds/Canary.svg' },
      { id: 'cardinal', name: 'Cardinal', file: 'Cardinal.svg', path: 'Animals/Birds/Cardinal.svg' },
      { id: 'blue_jay', name: 'Blue Jay', file: 'Blue_Jay.svg', path: 'Animals/Birds/Blue_Jay.svg' },
      { id: 'lovebirds', name: 'Lovebirds', file: 'Lovebirds.svg', path: 'Animals/Birds/Lovebirds.svg' },
      { id: 'cockatoo', name: 'Cockatoo', file: 'Cockatoo.svg', path: 'Animals/Birds/Cockatoo.svg' },
      { id: 'kingfisher', name: 'Kingfisher', file: 'Kingfisher.svg', path: 'Animals/Birds/Kingfisher.svg' },
      { id: 'blue_penguin', name: 'Blue Penguin', file: 'blue_penguin.svg', path: 'Animals/Birds/blue_penguin.svg' },
      { id: 'mandarin_duck', name: 'Mandarin Duck', file: 'mandarin_duck.svg', path: 'Animals/Birds/mandarin_duck.svg' },
      { id: 'flamingo_chick', name: 'Flamingo Chick', file: 'Flamingo_Chick.svg', path: 'Animals/Birds/Flamingo_Chick.svg' },
      { id: 'peacock', name: 'Peacock', file: 'Peacock.svg', path: 'Animals/Birds/Peacock.svg' },
      { id: 'sparrow', name: 'Sparrow', file: 'Sparrow.svg', path: 'Animals/Birds/Sparrow.svg' },
      { id: 'dove', name: 'Dove', file: 'Dove.svg', path: 'Animals/Birds/Dove.svg' },
      { id: 'swallow', name: 'Swallow', file: 'Swallow.svg', path: 'Animals/Birds/Swallow.svg' },
      { id: 'chickadee', name: 'Chickadee', file: 'chickadee.svg', path: 'Animals/Birds/chickadee.svg' },
      { id: 'goldcrest', name: 'Goldcrest', file: 'goldcrest.svg', path: 'Animals/Birds/goldcrest.svg' },
      { id: 'gouldian_finch', name: 'Gouldian Finch', file: 'gouldian_finch.svg', path: 'Animals/Birds/gouldian_finch.svg' },
      { id: 'superb_fairy_wren', name: 'Fairy-Wren', file: 'fairy_wren.svg', path: 'Animals/Birds/fairy_wren.svg' },
      { id: 'bohemian_waxwing', name: 'Bohemian Waxwing', file: 'bohemian_waxwing.svg', path: 'Animals/Birds/bohemian_waxwing.svg' },
      { id: 'blue_motmot', name: 'Blue Motmot', file: 'blue_crowned_motmot.svg', path: 'Animals/Birds/blue_crowned_motmot.svg' },
      { id: 'resplendent_quetzal', name: 'Quetzal', file: 'quetzal.svg', path: 'Animals/Birds/quetzal.svg' },
      { id: 'seagull', name: 'Seagull', file: 'Seagull.svg', path: 'Animals/Birds/Seagull.svg' },
      { id: 'pelican', name: 'Pelican', file: 'Pelican.svg', path: 'Animals/Birds/Pelican.svg' },
      { id: 'duck_01', name: 'Mallard Duck', file: 'Duck_01.svg', path: 'Animals/Birds/Duck_01.svg' },
      { id: 'ducks', name: 'Duck Family', file: 'Ducks.svg', path: 'Animals/Birds/Ducks.svg' },
      { id: 'barnacle_goose', name: 'Barnacle Goose', file: 'barnacle_goose.svg', path: 'Animals/Birds/barnacle_goose.svg' },
      { id: 'white_crane', name: 'White Crane', file: 'White_Crane.svg', path: 'Animals/Birds/White_Crane.svg' },
      { id: 'crowned_crane', name: 'Crowned Crane', file: 'crowned_crane.svg', path: 'Animals/Birds/crowned_crane.svg' },
      { id: 'stork', name: 'Stork', file: 'Stork.svg', path: 'Animals/Birds/Stork.svg' },
      { id: 'crowned_pigeon', name: 'Crowned Pigeon', file: 'crowned_pigeon.svg', path: 'Animals/Birds/crowned_pigeon.svg' },
      { id: 'pigeon', name: 'Pigeon', file: 'Pigeon.svg', path: 'Animals/Birds/Pigeon.svg' },
      { id: 'roseate_spoonbill', name: 'Roseate Spoonbill', file: 'roseate_spoonbill.svg', path: 'Animals/Birds/roseate_spoonbill.svg' },
      { id: 'scarlet_ibis', name: 'Scarlet Ibis', file: 'scarlet_ibis.svg', path: 'Animals/Birds/scarlet_ibis.svg' },
      { id: 'songbird', name: 'Songbird', file: 'Songbird.svg', path: 'Animals/Birds/Songbird.svg' },
      { id: 'kookaburra', name: 'Kookaburra', file: 'Kookaburra.svg', path: 'Animals/Birds/Kookaburra.svg' },
      { id: 'woodpeckers', name: 'Woodpecker Pair', file: 'Woodpeckers.svg', path: 'Animals/Birds/Woodpeckers.svg' },
      { id: 'owls', name: 'Twin Owls', file: 'Owls.svg', path: 'Animals/Birds/Owls.svg' },
      { id: 'great_hornbill', name: 'Great Hornbill', file: 'Great_Hornbill.svg', path: 'Animals/Birds/Great_Hornbill.svg' },
      { id: 'hoopoe', name: 'Hoopoe', file: 'Hoopoe.svg', path: 'Animals/Birds/Hoopoe.svg' },
      { id: 'blue_footed_booby', name: 'Blue-Footed Booby', file: 'Blue-Footed_Booby.svg', path: 'Animals/Birds/Blue-Footed_Booby.svg' },
      { id: 'macaw_parrot', name: 'Macaw Parrot', file: 'Macaw_Parrot.svg', path: 'Animals/Birds/Macaw_Parrot.svg' },
      { id: 'kiwi_bird', name: 'Kiwi Bird', file: 'Kiwi_Bird.svg', path: 'Animals/Birds/Kiwi_Bird.svg' },
      { id: 'ostrich', name: 'Ostrich', file: 'Ostrich.svg', path: 'Animals/Birds/Ostrich.svg' },
      { id: 'roadrunner', name: 'Roadrunner', file: 'Roadrunner.svg', path: 'Animals/Birds/Roadrunner.svg' },
      { id: 'albatross', name: 'Albatross', file: 'Albatross.svg', path: 'Animals/Birds/Albatross.svg' },
      { id: 'magpie', name: 'Magpie', file: 'Magpie.svg', path: 'Animals/Birds/Magpie.svg' },
      { id: 'cuckoo_bird', name: 'Cuckoo Bird', file: 'Cuckoo_Bird.svg', path: 'Animals/Birds/Cuckoo_Bird.svg' },
      { id: 'eagle', name: 'Eagle', file: 'Eagle.svg', path: 'Animals/Birds/Eagle.svg' },
      { id: 'falcon', name: 'Falcon', file: 'Falcon.svg', path: 'Animals/Birds/Falcon.svg' },
      { id: 'hawk', name: 'Hawk', file: 'Hawk.svg', path: 'Animals/Birds/Hawk.svg' },
      { id: 'osprey', name: 'Osprey', file: 'osprey.svg', path: 'Animals/Birds/osprey.svg' },
      { id: 'swallow_tailed_kite', name: 'Swallow-Tailed Kite', file: 'Swallow-Tailed_Kite.svg', path: 'Animals/Birds/Swallow-Tailed_Kite.svg' },
      { id: 'raven', name: 'Raven', file: 'Raven.svg', path: 'Animals/Birds/Raven.svg' },
      { id: 'crow', name: 'Black Crow', file: 'Crow.svg', path: 'Animals/Birds/Crow.svg' },
      { id: 'crow_02', name: 'Cawing Crow', file: 'Crow_02.svg', path: 'Animals/Birds/Crow_02.svg' },
      { id: 'kakapo', name: 'Kakapo', file: 'Kakapo.svg', path: 'Animals/Birds/Kakapo.svg' },
      { id: 'shoebill_stork', name: 'Shoebill Stork', file: 'Shoebill_Stork.svg', path: 'Animals/Birds/Shoebill_Stork.svg' },
      { id: 'secretary_bird', name: 'Secretary Bird', file: 'Secretary_Bird.svg', path: 'Animals/Birds/Secretary_Bird.svg' },
      { id: 'umbrellabird', name: 'Umbrellabird', file: 'Umbrellabird.svg', path: 'Animals/Birds/Umbrellabird.svg' },
      { id: 'lyrebird', name: 'Lyrebird', file: 'Lyrebird.svg', path: 'Animals/Birds/Lyrebird.svg' },
      { id: 'hoatzin', name: 'Hoatzin', file: 'hoatzin.svg', path: 'Animals/Birds/hoatzin.svg' },
      { id: 'capercaillie', name: 'Forest Capercaillie', file: 'Capercaillie.svg', path: 'Animals/Birds/Capercaillie.svg' },
      { id: 'capercaillie_01', name: 'Woodland Capercaillie', file: 'Capercaillie_01.svg', path: 'Animals/Birds/Capercaillie_01.svg' },
    ]
  },
  {
    id: 'dinosaurs',
    name: 'Dinosaurs',
    shortName: 'Dinosaurs',
    title: 'Mighty Dino World',
    emoji: '🦖',
    icon: 'Categories/Dinosaur.webp',
    circleBg: '#e07a5f',
    color: '#c85a3a',
    bg: '#fef7f2',
    animals: [
      { id: 'baby_t_rex_01', name: 'Baby T-Rex', file: 'Baby_T-Rex_01.svg', path: 'Animals/Dinosaurs/Baby_T-Rex_01.svg' },
      { id: 'triceratops_01', name: 'Triceratops', file: 'Triceratops_01.svg', path: 'Animals/Dinosaurs/Triceratops_01.svg' },
      { id: 'baby_brachiosaurus_01', name: 'Baby Brachiosaur', file: 'Baby_Brachiosaurus_01.svg', path: 'Animals/Dinosaurs/Baby_Brachiosaurus_01.svg' },
      { id: 'stegosaurus_01', name: 'Plate Stegosaur', file: 'Stegosaurus_01.svg', path: 'Animals/Dinosaurs/Stegosaurus_01.svg' },
      { id: 'pterodactyl_01', name: 'Flying Pterodactyl', file: 'Pterodactyl_01.svg', path: 'Animals/Dinosaurs/Pterodactyl_01.svg' },
      { id: 'baby_dinosaur', name: 'Dino', file: 'Baby_Dinosaur.svg', path: 'Animals/Dinosaurs/Baby_Dinosaur.svg' },
      { id: 'ankylosaurus_01', name: 'Ankylosaurus', file: 'Ankylosaurus_01.svg', path: 'Animals/Dinosaurs/Ankylosaurus_01.svg' },
      { id: 'woolly_mammoth', name: 'Mammoth', file: 'Woolly_Mammoth.svg', path: 'Animals/Dinosaurs/Woolly_Mammoth.svg' },
      { id: 'apatosaurus', name: 'Apatosaurus', file: 'apatosaurus.svg', path: 'Animals/Dinosaurs/apatosaurus.svg' },
      { id: 'spinosaurus_01', name: 'Spinosaurus', file: 'Spinosaurus_01.svg', path: 'Animals/Dinosaurs/Spinosaurus_01.svg' },
      { id: 'velociraptor_01', name: 'Velociraptor', file: 'Velociraptor_01.svg', path: 'Animals/Dinosaurs/Velociraptor_01.svg' },
      { id: 'parasaurolophus', name: 'Parasaurolophus', file: 'parasaurolophus.svg', path: 'Animals/Dinosaurs/parasaurolophus.svg' },
      { id: 'baby_therizinosaurus', name: 'Baby Therizino', file: 'baby_therizinosaurus.svg', path: 'Animals/Dinosaurs/baby_therizinosaurus.svg' },
      { id: 'maiasaura', name: 'Maiasaura', file: 'maiasaura.svg', path: 'Animals/Dinosaurs/maiasaura.svg' },
      { id: 'pachycephalosaurus', name: 'Pachycephalo', file: 'pachycephalosaurus.svg', path: 'Animals/Dinosaurs/pachycephalosaurus.svg' },
      { id: 'diplodocus', name: 'Diplodocus', file: 'Diplodocus.svg', path: 'Animals/Dinosaurs/Diplodocus.svg' },
      { id: 'baby_duckbill', name: 'Baby Duckbill', file: 'baby_duckbill.svg', path: 'Animals/Dinosaurs/baby_duckbill.svg' },
      { id: 'styracosaurus', name: 'Styracosaurus', file: 'styracosaurus.svg', path: 'Animals/Dinosaurs/styracosaurus.svg' },
      { id: 'brachiosaurus_gentle', name: 'Tall Brachiosaur', file: 'brachiosaurus.svg', path: 'Animals/Dinosaurs/brachiosaurus.svg' },
      { id: 'stegosaurus_spiky', name: 'Spiky Stegosaur', file: 'stegosaurus.svg', path: 'Animals/Dinosaurs/stegosaurus.svg' },
      { id: 't_rex_02', name: 'Mighty T-Rex', file: 'Tyrannosaurus_Rex_02.svg', path: 'Animals/Dinosaurs/Tyrannosaurus_Rex_02.svg' },
      { id: 'pterodactyl_soaring', name: 'Soaring Pterosaur', file: 'pterodactyl.svg', path: 'Animals/Dinosaurs/pterodactyl.svg' },
      { id: 'camarasaurus', name: 'Camarasaurus', file: 'camarasaurus.svg', path: 'Animals/Dinosaurs/camarasaurus.svg' },
      { id: 'edmontosaurus', name: 'Edmontosaurus', file: 'edmontosaurus.svg', path: 'Animals/Dinosaurs/edmontosaurus.svg' },
      { id: 'euoplocephalus', name: 'Euoplocephalus', file: 'euoplocephalus.svg', path: 'Animals/Dinosaurs/euoplocephalus.svg' },
      { id: 'gallimimus', name: 'Gallimimus', file: 'gallimimus.svg', path: 'Animals/Dinosaurs/gallimimus.svg' },
      { id: 'protoceratops_01', name: 'Protoceratops', file: 'protoceratops_01.svg', path: 'Animals/Dinosaurs/protoceratops_01.svg' },
      { id: 'microceratus', name: 'Microceratus', file: 'microceratus.svg', path: 'Animals/Dinosaurs/microceratus.svg' },
      { id: 'ouranosaurus', name: 'Ouranosaurus', file: 'ouranosaurus.svg', path: 'Animals/Dinosaurs/ouranosaurus.svg' },
      { id: 'struthiomimus', name: 'Struthiomimus', file: 'struthiomimus.svg', path: 'Animals/Dinosaurs/struthiomimus.svg' },
      { id: 'struthiomimus_runner', name: 'Struthio Runner', file: 'struthiomimus_01.svg', path: 'Animals/Dinosaurs/struthiomimus_01.svg' },
      { id: 'deinocheirus', name: 'Deinocheirus', file: 'deinocheirus.svg', path: 'Animals/Dinosaurs/deinocheirus.svg' },
      { id: 'corythosaurus', name: 'Corythosaurus', file: 'Corythosaurus.svg', path: 'Animals/Dinosaurs/Corythosaurus.svg' },
      { id: 'iguanodon', name: 'Iguanodon', file: 'Iguanodon.svg', path: 'Animals/Dinosaurs/Iguanodon.svg' },
      { id: 'oviraptor', name: 'Oviraptor', file: 'Oviraptor.svg', path: 'Animals/Dinosaurs/Oviraptor.svg' },
      { id: 'plesiosaur', name: 'Plesiosaur', file: 'Plesiosaur.svg', path: 'Animals/Dinosaurs/Plesiosaur.svg' },
      { id: 'quetzalcoatlus', name: 'Quetzalcoatlus', file: 'Quetzalcoatlus.svg', path: 'Animals/Dinosaurs/Quetzalcoatlus.svg' },
      { id: 'megatherium', name: 'Megatherium', file: 'megatherium.svg', path: 'Animals/Dinosaurs/megatherium.svg' },
      { id: 'sabertooth_tiger', name: 'Sabertooth', file: 'Sabertooth_Tiger.svg', path: 'Animals/Dinosaurs/Sabertooth_Tiger.svg' },
      { id: 'megalodon', name: 'Megalodon', file: 'Megalodon.svg', path: 'Animals/Dinosaurs/Megalodon.svg' },
      { id: 'dodo_bird', name: 'Dodo', file: 'Dodo_Bird.svg', path: 'Animals/Dinosaurs/Dodo_Bird.svg' },
    ]
  },
  {
    id: 'insects',
    name: 'Insects',
    shortName: 'Insects',
    title: 'Little Bugs & Insects',
    emoji: '🐝',
    icon: 'Categories/Honeybee.svg',
    circleBg: '#fb923c',
    color: '#ea580c',
    bg: '#fff8f5',
    animals: [
      { id: 'butterfly', name: 'Painted Butterfly', file: 'Butterfly.svg', path: 'Animals/Insects/Butterfly.svg' },
      { id: 'ladybug_safe', name: 'Ladybug', file: 'ladybug.svg', path: 'Animals/Insects/ladybug.svg' },
      { id: 'bumblebee', name: 'Bumblebee', file: 'Bumblebee.svg', path: 'Animals/Insects/Bumblebee.svg' },
      { id: 'caterpillar', name: 'Caterpillar', file: 'Caterpillar.svg', path: 'Animals/Insects/Caterpillar.svg' },
      { id: 'dragonfly', name: 'Dragonfly', file: 'Dragonfly.svg', path: 'Animals/Insects/Dragonfly.svg' },
      { id: 'snail_safe', name: 'Snail', file: 'snail.svg', path: 'Animals/Insects/snail.svg' },
      { id: 'firefly', name: 'Firefly', file: 'Firefly.svg', path: 'Animals/Insects/Firefly.svg' },
      { id: 'monarch_butterfly', name: 'Monarch Butterfly', file: 'Monarch_Butterfly.svg', path: 'Animals/Insects/Monarch_Butterfly.svg' },
      { id: 'grasshopper_safe', name: 'Grasshopper', file: 'grasshopper.svg', path: 'Animals/Insects/grasshopper.svg' },
      { id: 'roly_poly', name: 'Roly-Poly', file: 'roly_poly.svg', path: 'Animals/Insects/roly_poly.svg' },
      { id: 'blue_morpho', name: 'Blue Morpho', file: 'blue_morpho.svg', path: 'Animals/Insects/blue_morpho.svg' },
      { id: 'ant', name: 'Ant', file: 'Ant.svg', path: 'Animals/Insects/Ant.svg' },
      { id: 'spider_safe', name: 'Jumping Spider', file: 'spider.svg', path: 'Animals/Insects/spider.svg' },
      { id: 'glowworm', name: 'Glowworm', file: 'glowworm.svg', path: 'Animals/Insects/glowworm.svg' },
      { id: 'silkworm', name: 'Silkworm', file: 'Silkworm.svg', path: 'Animals/Insects/Silkworm.svg' },
      { id: 'swallowtail_butterfly', name: 'Swallowtail', file: 'swallowtail_butterfly.svg', path: 'Animals/Insects/swallowtail_butterfly.svg' },
      { id: 'peacock_butterfly', name: 'Peacock Butterfly', file: 'peacock_butterfly.svg', path: 'Animals/Insects/peacock_butterfly.svg' },
      { id: 'damselfly', name: 'Damselfly', file: 'damselfly.svg', path: 'Animals/Insects/damselfly.svg' },
      { id: 'cricket', name: 'Cricket', file: 'Cricket.svg', path: 'Animals/Insects/Cricket.svg' },
      { id: 'rhinoceros_beetle', name: 'Rhinoceros Beetle', file: 'Rhinoceros_Beetle.svg', path: 'Animals/Insects/Rhinoceros_Beetle.svg' },
      { id: 'luna_moth', name: 'Luna Moth', file: 'Luna_Moth.svg', path: 'Animals/Insects/Luna_Moth.svg' },
      { id: 'atlas_moth', name: 'Atlas Moth', file: 'atlas_moth.svg', path: 'Animals/Insects/atlas_moth.svg' },
      { id: 'jewel_beetle', name: 'Jewel Beetle', file: 'Jewel_Beetle.svg', path: 'Animals/Insects/Jewel_Beetle.svg' },
      { id: 'bee_wild', name: 'Honey Bee', file: 'Bee.svg', path: 'Animals/Insects/Bee.svg' },
      { id: 'hercules_beetle', name: 'Hercules Beetle', file: 'Hercules_Beetle.svg', path: 'Animals/Insects/Hercules_Beetle.svg' },
      { id: 'stag_beetle', name: 'Stag Beetle', file: 'Stag_Beetle.svg', path: 'Animals/Insects/Stag_Beetle.svg' },
      { id: 'tortoise_beetle', name: 'Tortoise Beetle', file: 'tortoise_beetle.svg', path: 'Animals/Insects/tortoise_beetle.svg' },
      { id: 'leaf_insect', name: 'Leaf Insect', file: 'leaf_insect.svg', path: 'Animals/Insects/leaf_insect.svg' },
      { id: 'fairy_bug', name: 'Fairy Bug', file: 'fairy_bug.svg', path: 'Animals/Insects/fairy_bug.svg' },
      { id: 'woolly_bear', name: 'Woolly Bear', file: 'woolly_bear.svg', path: 'Animals/Insects/woolly_bear.svg' },
      { id: 'acorn_weevil', name: 'Acorn Weevil', file: 'acorn_weevil.svg', path: 'Animals/Insects/acorn_weevil.svg' },
      { id: 'beetle', name: 'Garden Beetle', file: 'Beetle.svg', path: 'Animals/Insects/Beetle.svg' },
      { id: 'shield_bug', name: 'Shield Bug', file: 'Shield_Bug.svg', path: 'Animals/Insects/Shield_Bug.svg' },
      { id: 'cicada', name: 'Cicada', file: 'Cicada.svg', path: 'Animals/Insects/Cicada.svg' },
      { id: 'walking_stick', name: 'Walking Stick', file: 'walking_stick.svg', path: 'Animals/Insects/walking_stick.svg' },
      { id: 'water_strider', name: 'Water Strider', file: 'Water_Strider.svg', path: 'Animals/Insects/Water_Strider.svg' },
      { id: 'water_boatman', name: 'Water Boatman', file: 'water_boatman.svg', path: 'Animals/Insects/water_boatman.svg' },
      { id: 'june_bug', name: 'June Bug', file: 'june_bug.svg', path: 'Animals/Insects/june_bug.svg' },
      { id: 'katydid', name: 'Katydid', file: 'katydid.svg', path: 'Animals/Insects/katydid.svg' },
      { id: 'praying_mantis', name: 'Praying Mantis', file: 'Praying_Mantis.svg', path: 'Animals/Insects/Praying_Mantis.svg' },
      { id: 'millipede_01', name: 'Little Millipede', file: 'Millipede_01.svg', path: 'Animals/Insects/Millipede_01.svg' },
    ]
  }
];

// Double-lock sanitizer: strictly filters out any Black or White from the 3 quick primary crayons
function sanitizePrimaryPalette(palette) {
  const BLACK_LIST = ['#000000', '#1e293b', '#0f172a', '#111827', '#18181b', '#27272a'];
  const WHITE_LIST = ['#ffffff', '#fff', '#fefefe', '#fafafa', '#f8fafc', '#faf8f5'];
  const VIBRANTS = [
    { hex: '#f97316', name: 'Warm Orange' },
    { hex: '#eab308', name: 'Sunny Yellow' },
    { hex: '#22c55e', name: 'Meadow Green' },
    { hex: '#3b82f6', name: 'Sky Blue' },
    { hex: '#ec4899', name: 'Candy Pink' },
    { hex: '#a855f7', name: 'Violet Purple' },
    { hex: '#14b8a6', name: 'Ocean Teal' }
  ];
  let repIdx = 0;

  return palette.map(c => {
    const hex = (c.hex || '').toLowerCase();
    const isBlack = BLACK_LIST.includes(hex) || hex.startsWith('#1e29');
    const isWhite = c.isWhite || WHITE_LIST.includes(hex);
    if (isBlack || isWhite) {
      const fb = VIBRANTS[repIdx++ % VIBRANTS.length];
      return { hex: fb.hex, name: fb.name };
    }
    return c;
  });
}

// Returns 3 vibrant curated animal-specific colors with NO Black and NO White
export function getAnimalColors(animal, categoryId) {
  const raw = `${animal?.name || ''} ${animal?.id || ''} ${animal?.file || ''}`.toLowerCase();
  const name = raw.replace(/[-_]/g, ' ');

  // === 1. ROOSTER, CHICKEN, HEN, CHICK ===
  if (name.includes('rooster')) {
    return sanitizePrimaryPalette([
      { hex: '#ef4444', name: 'Crimson Red' },
      { hex: '#f59e0b', name: 'Amber Gold' },
      { hex: '#ea580c', name: 'Deep Orange' }
    ]);
  }
  if (name.includes('chicken') || name.includes('hen') || name.includes('bantam')) {
    return sanitizePrimaryPalette([
      { hex: '#ef4444', name: 'Comb Red' },
      { hex: '#f97316', name: 'Warm Orange' },
      { hex: '#facc15', name: 'Sunny Gold' }
    ]);
  }
  if (name.includes('chick')) {
    return sanitizePrimaryPalette([
      { hex: '#fde047', name: 'Fluffy Yellow' },
      { hex: '#f97316', name: 'Beak Orange' },
      { hex: '#22c55e', name: 'Pasture Green' }
    ]);
  }

  // === 2. HORSE, PONY, FOAL, MULE, DONKEY ===
  if (name.includes('horse') || name.includes('foal') || name.includes('stallion')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'Chestnut Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#f59e0b', name: 'Caramel Gold' }
    ]);
  }
  if (name.includes('pony')) {
    return sanitizePrimaryPalette([
      { hex: '#854d0e', name: 'Pony Brown' },
      { hex: '#d97706', name: 'Warm Tan' },
      { hex: '#f59e0b', name: 'Honey Gold' }
    ]);
  }
  if (name.includes('donkey') || name.includes('mule')) {
    return sanitizePrimaryPalette([
      { hex: '#64748b', name: 'Slate Gray' },
      { hex: '#d97706', name: 'Warm Tan' },
      { hex: '#f59e0b', name: 'Muzzle Gold' }
    ]);
  }

  // === 3. CATTLE: COW, CALF, HIGHLAND, OX, YAK, BUFFALO, BISON, ZEBU ===
  if (name.includes('highland')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'Deep Auburn' },
      { hex: '#ea580c', name: 'Highland Rust' },
      { hex: '#f59e0b', name: 'Horn Gold' }
    ]);
  }
  if (name.includes('ox') || name.includes('yak') || name.includes('buffalo') || name.includes('bison')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'Shaggy Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#f59e0b', name: 'Horn Gold' }
    ]);
  }
  if (name.includes('cow') || name.includes('calf') || name.includes('zebu')) {
    return sanitizePrimaryPalette([
      { hex: '#d97706', name: 'Tan Patch' },
      { hex: '#f472b6', name: 'Snout Pink' },
      { hex: '#22c55e', name: 'Pasture Green' }
    ]);
  }

  // === 4. SHEEP, LAMB, GOAT ===
  if (name.includes('sheep') || name.includes('lamb')) {
    return sanitizePrimaryPalette([
      { hex: '#38bdf8', name: 'Sky Cyan' },
      { hex: '#f472b6', name: 'Ear Pink' },
      { hex: '#22c55e', name: 'Meadow Green' }
    ]);
  }
  if (name.includes('goat')) {
    return sanitizePrimaryPalette([
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#f59e0b', name: 'Horn Amber' },
      { hex: '#22c55e', name: 'Grass Green' }
    ]);
  }

  // === 5. PIG & HOG ===
  if (name.includes('pig') || name.includes('hog') || name.includes('warthog')) {
    return sanitizePrimaryPalette([
      { hex: '#ec4899', name: 'Rosy Pink' },
      { hex: '#fb7185', name: 'Cheek Rose' },
      { hex: '#d97706', name: 'Mud Tan' }
    ]);
  }

  // === 6. CAMEL, ALPACA, LLAMA, VICUNA, GUANACO ===
  if (name.includes('camel')) {
    return sanitizePrimaryPalette([
      { hex: '#d97706', name: 'Desert Tan' },
      { hex: '#f59e0b', name: 'Warm Amber' },
      { hex: '#14b8a6', name: 'Oasis Teal' }
    ]);
  }
  if (name.includes('alpaca') || name.includes('llama') || name.includes('vicuna') || name.includes('guanaco')) {
    return sanitizePrimaryPalette([
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#f59e0b', name: 'Wool Gold' },
      { hex: '#f472b6', name: 'Rosy Ear' }
    ]);
  }

  // === 7. RABBIT & BUNNY ===
  if (name.includes('rabbit') || name.includes('bunny') || name.includes('hare')) {
    return sanitizePrimaryPalette([
      { hex: '#f472b6', name: 'Ear Pink' },
      { hex: '#f97316', name: 'Carrot Orange' },
      { hex: '#38bdf8', name: 'Sky Cyan' }
    ]);
  }

  // === 8. WATERFOWL: DUCK, DUCKLING, GOOSE, SWAN, TURKEY ===
  if (name.includes('duck') || name.includes('duckling') || name.includes('mallard')) {
    return sanitizePrimaryPalette([
      { hex: '#facc15', name: 'Sunny Yellow' },
      { hex: '#f97316', name: 'Bill Orange' },
      { hex: '#15803d', name: 'Mallard Green' }
    ]);
  }
  if (name.includes('goose') || name.includes('gosling')) {
    return sanitizePrimaryPalette([
      { hex: '#f97316', name: 'Beak Orange' },
      { hex: '#38bdf8', name: 'Pond Blue' },
      { hex: '#22c55e', name: 'Reed Green' }
    ]);
  }
  if (name.includes('swan')) {
    return sanitizePrimaryPalette([
      { hex: '#38bdf8', name: 'Lake Aqua' },
      { hex: '#f97316', name: 'Beak Orange' },
      { hex: '#f472b6', name: 'Lotus Pink' }
    ]);
  }
  if (name.includes('turkey')) {
    return sanitizePrimaryPalette([
      { hex: '#ef4444', name: 'Wattle Red' },
      { hex: '#b45309', name: 'Feather Brown' },
      { hex: '#f59e0b', name: 'Harvest Gold' }
    ]);
  }

  // === 9. DOGS & PUPS ===
  if (name.includes('retriever') || name.includes('corgi') || name.includes('pomeranian')) {
    return sanitizePrimaryPalette([
      { hex: '#eab308', name: 'Golden Fur' },
      { hex: '#d97706', name: 'Warm Tan' },
      { hex: '#ef4444', name: 'Collar Red' }
    ]);
  }
  if (name.includes('bulldog') || name.includes('pug') || name.includes('basset') || name.includes('beagle') || name.includes('hound') || name.includes('saint bernard') || name.includes('collie') || name.includes('dachshund')) {
    return sanitizePrimaryPalette([
      { hex: '#854d0e', name: 'Saddle Brown' },
      { hex: '#d97706', name: 'Tan Snout' },
      { hex: '#3b82f6', name: 'Collar Blue' }
    ]);
  }
  if (name.includes('husky') || name.includes('dalmatian') || name.includes('poodle') || name.includes('chihuahua') || name.includes('shih tzu') || name.includes('shihtzu') || name.includes('yorkie') || name.includes('dog')) {
    return sanitizePrimaryPalette([
      { hex: '#2563eb', name: 'Collar Royal Blue' },
      { hex: '#d97706', name: 'Warm Tan' },
      { hex: '#ef4444', name: 'Collar Red' }
    ]);
  }

  // === 10. CATS & KITTENS ===
  if (name.includes('ginger') || name.includes('munchkin')) {
    return sanitizePrimaryPalette([
      { hex: '#f97316', name: 'Ginger Orange' },
      { hex: '#facc15', name: 'Honey Gold' },
      { hex: '#f472b6', name: 'Snout Pink' }
    ]);
  }
  if (name.includes('cat') || name.includes('kitten')) {
    return sanitizePrimaryPalette([
      { hex: '#d97706', name: 'Calico Tan' },
      { hex: '#0284c7', name: 'Jewel Blue' },
      { hex: '#f472b6', name: 'Nose Pink' }
    ]);
  }

  // === 11. SMALL PETS & WOODLAND CRITTERS ===
  if (name.includes('hedgehog') || name.includes('porcupine')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'Quill Brown' },
      { hex: '#d97706', name: 'Belly Tan' },
      { hex: '#22c55e', name: 'Apple Green' }
    ]);
  }
  if (name.includes('mouse') || name.includes('hamster') || name.includes('guinea') || name.includes('ferret') || name.includes('chinchilla') || name.includes('gerbil') || name.includes('sugar glider')) {
    return sanitizePrimaryPalette([
      { hex: '#d97706', name: 'Warm Tan' },
      { hex: '#f472b6', name: 'Nose Pink' },
      { hex: '#facc15', name: 'Seed Gold' }
    ]);
  }
  if (name.includes('squirrel') || name.includes('chipmunk')) {
    return sanitizePrimaryPalette([
      { hex: '#854d0e', name: 'Acorn Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#f59e0b', name: 'Belly Gold' }
    ]);
  }
  if (name.includes('beaver') || name.includes('platypus') || name.includes('otter') || name.includes('capybara')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'River Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#38bdf8', name: 'Stream Aqua' }
    ]);
  }
  if (name.includes('sloth')) {
    return sanitizePrimaryPalette([
      { hex: '#854d0e', name: 'Cozy Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#22c55e', name: 'Canopy Green' }
    ]);
  }
  if (name.includes('armadillo') || name.includes('pangolin') || name.includes('tamandua') || name.includes('anteater') || name.includes('aardvark') || name.includes('paca') || name.includes('agouti')) {
    return sanitizePrimaryPalette([
      { hex: '#854d0e', name: 'Shell Brown' },
      { hex: '#d97706', name: 'Warm Tan' },
      { hex: '#f59e0b', name: 'Golden Amber' }
    ]);
  }
  if (name.includes('skunk') || name.includes('badger') || name.includes('raccoon') || name.includes('opossum') || name.includes('zorilla') || name.includes('tasmanian devil') || name.includes('aye aye')) {
    return sanitizePrimaryPalette([
      { hex: '#4338ca', name: 'Midnight Indigo' },
      { hex: '#8b5cf6', name: 'Striped Violet' },
      { hex: '#facc15', name: 'Moon Gold' }
    ]);
  }
  if (name.includes('meerkat')) {
    return sanitizePrimaryPalette([
      { hex: '#d97706', name: 'Desert Amber' },
      { hex: '#eab308', name: 'Sun Sand' },
      { hex: '#854d0e', name: 'Earth Brown' }
    ]);
  }
  if (name.includes('bat')) {
    return sanitizePrimaryPalette([
      { hex: '#6366f1', name: 'Wing Indigo' },
      { hex: '#a855f7', name: 'Night Violet' },
      { hex: '#facc15', name: 'Moon Gold' }
    ]);
  }
  if (name.includes('okapi')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'Rich Mahogany' },
      { hex: '#3b82f6', name: 'Leg Indigo' },
      { hex: '#f59e0b', name: 'Warm Gold' }
    ]);
  }
  if (name.includes('tapir')) {
    return sanitizePrimaryPalette([
      { hex: '#854d0e', name: 'Earth Brown' },
      { hex: '#fb7185', name: 'Cheek Peach' },
      { hex: '#22c55e', name: 'Forest Green' }
    ]);
  }
  if (name.includes('kinkajou') || name.includes('coatimundi') || name.includes('binturong') || name.includes('colugo') || name.includes('fossa')) {
    return sanitizePrimaryPalette([
      { hex: '#854d0e', name: 'Jungle Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#facc15', name: 'Honey Amber' }
    ]);
  }

  // === 12. JUNGLE BIG CATS ===
  if (name.includes('lion')) {
    return sanitizePrimaryPalette([
      { hex: '#eab308', name: 'Golden Fur' },
      { hex: '#ea580c', name: 'Mane Amber' },
      { hex: '#d97706', name: 'Warm Tan' }
    ]);
  }
  if (name.includes('tiger') || name.includes('sabertooth')) {
    return sanitizePrimaryPalette([
      { hex: '#f97316', name: 'Tiger Orange' },
      { hex: '#eab308', name: 'Sunburst Gold' },
      { hex: '#ea580c', name: 'Amber Rust' }
    ]);
  }
  if (name.includes('cheetah') || name.includes('leopard') || name.includes('jaguar')) {
    return sanitizePrimaryPalette([
      { hex: '#facc15', name: 'Cheetah Gold' },
      { hex: '#ea580c', name: 'Amber Spot' },
      { hex: '#b45309', name: 'Savannah Tan' }
    ]);
  }
  if (name.includes('panther')) {
    return sanitizePrimaryPalette([
      { hex: '#4338ca', name: 'Midnight Indigo' },
      { hex: '#eab308', name: 'Gold Eyes' },
      { hex: '#10b981', name: 'Jungle Emerald' }
    ]);
  }

  // === 13. ELEPHANTS, RHINOS, HIPPOS ===
  if (name.includes('elephant')) {
    return sanitizePrimaryPalette([
      { hex: '#38bdf8', name: 'Sky Aqua' },
      { hex: '#f472b6', name: 'Rosy Cheek' },
      { hex: '#facc15', name: 'Safari Gold' }
    ]);
  }
  if (name.includes('hippo')) {
    return sanitizePrimaryPalette([
      { hex: '#60a5fa', name: 'River Blue' },
      { hex: '#f472b6', name: 'Blossom Pink' },
      { hex: '#22c55e', name: 'Grass Green' }
    ]);
  }
  if (name.includes('rhino')) {
    return sanitizePrimaryPalette([
      { hex: '#60a5fa', name: 'Savannah Blue' },
      { hex: '#f59e0b', name: 'Horn Gold' },
      { hex: '#d97706', name: 'Earth Amber' }
    ]);
  }

  // === 14. GIRAFFE & ZEBRA ===
  if (name.includes('giraffe')) {
    return sanitizePrimaryPalette([
      { hex: '#eab308', name: 'Giraffe Yellow' },
      { hex: '#78350f', name: 'Patch Brown' },
      { hex: '#d97706', name: 'Warm Tan' }
    ]);
  }
  if (name.includes('zebra')) {
    return sanitizePrimaryPalette([
      { hex: '#2563eb', name: 'Safari Blue' },
      { hex: '#f97316', name: 'Warm Orange' },
      { hex: '#22c55e', name: 'Plains Green' }
    ]);
  }

  // === 15. BEARS ===
  if (name.includes('polar')) {
    return sanitizePrimaryPalette([
      { hex: '#38bdf8', name: 'Arctic Ice Blue' },
      { hex: '#06b6d4', name: 'Frost Cyan' },
      { hex: '#facc15', name: 'Sun Gold' }
    ]);
  }
  if (name.includes('panda')) {
    return sanitizePrimaryPalette([
      { hex: '#22c55e', name: 'Bamboo Green' },
      { hex: '#facc15', name: 'Honey Gold' },
      { hex: '#f472b6', name: 'Blossom Pink' }
    ]);
  }
  if (name.includes('bear')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'Bear Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#f59e0b', name: 'Honey Amber' }
    ]);
  }

  // === 16. PRIMATES ===
  if (name.includes('tamarin')) {
    return sanitizePrimaryPalette([
      { hex: '#f59e0b', name: 'Golden Fur' },
      { hex: '#ea580c', name: 'Mane Orange' },
      { hex: '#22c55e', name: 'Canopy Green' }
    ]);
  }
  if (name.includes('lemur') || name.includes('loris')) {
    return sanitizePrimaryPalette([
      { hex: '#f59e0b', name: 'Amber Eyes' },
      { hex: '#8b5cf6', name: 'Velvet Violet' },
      { hex: '#22c55e', name: 'Jungle Leaf' }
    ]);
  }
  if (name.includes('monkey') || name.includes('chimp') || name.includes('baboon') || name.includes('gorilla') || name.includes('langur') || name.includes('proboscis') || name.includes('uakari') || name.includes('ape')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'Deep Brown' },
      { hex: '#d97706', name: 'Tan Face' },
      { hex: '#facc15', name: 'Banana Yellow' }
    ]);
  }

  // === 17. DEER, FAWN, GAZELLE, MOOSE, DIK-DIK ===
  if (name.includes('moose')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'Forest Brown' },
      { hex: '#b45309', name: 'Antler Tan' },
      { hex: '#16a34a', name: 'Pine Green' }
    ]);
  }
  if (name.includes('deer') || name.includes('fawn') || name.includes('gazelle') || name.includes('antelope') || name.includes('dik dik') || name.includes('mara')) {
    return sanitizePrimaryPalette([
      { hex: '#854d0e', name: 'Fawn Brown' },
      { hex: '#b45309', name: 'Light Tan' },
      { hex: '#f59e0b', name: 'Amber Gold' }
    ]);
  }

  // === 18. KANGAROO, KOALA, WOMBAT, QUOKKA ===
  if (name.includes('koala')) {
    return sanitizePrimaryPalette([
      { hex: '#22c55e', name: 'Eucalyptus Green' },
      { hex: '#a855f7', name: 'Lilac' },
      { hex: '#f472b6', name: 'Ear Pink' }
    ]);
  }
  if (name.includes('kangaroo') || name.includes('quokka') || name.includes('wombat') || name.includes('cuscus') || name.includes('wallaby')) {
    return sanitizePrimaryPalette([
      { hex: '#854d0e', name: 'Bush Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#f59e0b', name: 'Outback Gold' }
    ]);
  }

  // === 19. FOX & WOLF ===
  if (name.includes('wolf') || name.includes('hyena') || name.includes('jackal')) {
    return sanitizePrimaryPalette([
      { hex: '#60a5fa', name: 'Sky Blue' },
      { hex: '#854d0e', name: 'Coat Brown' },
      { hex: '#f59e0b', name: 'Amber Gold' }
    ]);
  }
  if (name.includes('fox')) {
    return sanitizePrimaryPalette([
      { hex: '#ea580c', name: 'Fox Red' },
      { hex: '#f97316', name: 'Warm Orange' },
      { hex: '#facc15', name: 'Chest Gold' }
    ]);
  }

  // === 20. REPTILES & AMPHIBIANS ===
  if (name.includes('crocodile') || name.includes('alligator') || name.includes('gharial')) {
    return sanitizePrimaryPalette([
      { hex: '#15803d', name: 'Croc Green' },
      { hex: '#84cc16', name: 'Olive Lime' },
      { hex: '#eab308', name: 'Eye Gold' }
    ]);
  }
  if (name.includes('chameleon') || name.includes('gecko') || name.includes('iguana') || name.includes('lizard') || name.includes('komodo')) {
    return sanitizePrimaryPalette([
      { hex: '#10b981', name: 'Emerald Green' },
      { hex: '#facc15', name: 'Sun Yellow' },
      { hex: '#06b6d4', name: 'Vibrant Cyan' }
    ]);
  }
  if (name.includes('frog') || name.includes('toad')) {
    return sanitizePrimaryPalette([
      { hex: '#16a34a', name: 'Tree Frog Green' },
      { hex: '#84cc16', name: 'Spring Lime' },
      { hex: '#facc15', name: 'Sunny Yellow' }
    ]);
  }

  // === 21. AQUATIC ANIMALS ===
  if (name.includes('axolotl')) {
    return sanitizePrimaryPalette([
      { hex: '#f472b6', name: 'Axolotl Pink' },
      { hex: '#fb7185', name: 'Gill Rose' },
      { hex: '#06b6d4', name: 'Glow Cyan' }
    ]);
  }
  if (name.includes('manatee')) {
    return sanitizePrimaryPalette([
      { hex: '#60a5fa', name: 'Ocean Slate' },
      { hex: '#38bdf8', name: 'Marine Aqua' },
      { hex: '#22c55e', name: 'Seaweed Green' }
    ]);
  }
  if (name.includes('leafy sea dragon')) {
    return sanitizePrimaryPalette([
      { hex: '#10b981', name: 'Emerald Leaf' },
      { hex: '#06b6d4', name: 'Ocean Cyan' },
      { hex: '#facc15', name: 'Coral Gold' }
    ]);
  }
  if (name.includes('shell') || name.includes('conch') || name.includes('scallop') || name.includes('nautilus')) {
    return sanitizePrimaryPalette([
      { hex: '#fb7185', name: 'Peach Coral' },
      { hex: '#facc15', name: 'Sand Gold' },
      { hex: '#14b8a6', name: 'Seafoam Teal' }
    ]);
  }
  if (name.includes('dolphin')) {
    return sanitizePrimaryPalette([
      { hex: '#38bdf8', name: 'Dolphin Blue' },
      { hex: '#0284c7', name: 'Deep Ocean' },
      { hex: '#f97316', name: 'Sunny Coral' }
    ]);
  }
  if (name.includes('whale') || name.includes('beluga') || name.includes('narwhal')) {
    return sanitizePrimaryPalette([
      { hex: '#0284c7', name: 'Whale Blue' },
      { hex: '#38bdf8', name: 'Iceberg Aqua' },
      { hex: '#fb7185', name: 'Coral Pink' }
    ]);
  }
  if (name.includes('shark') || name.includes('megalodon')) {
    return sanitizePrimaryPalette([
      { hex: '#0284c7', name: 'Deep Navy' },
      { hex: '#38bdf8', name: 'Fin Aqua' },
      { hex: '#fb7185', name: 'Coral Rose' }
    ]);
  }
  if (name.includes('clown')) {
    return sanitizePrimaryPalette([
      { hex: '#f97316', name: 'Clown Orange' },
      { hex: '#facc15', name: 'Sun Gold' },
      { hex: '#06b6d4', name: 'Reef Cyan' }
    ]);
  }
  if (name.includes('goldfish')) {
    return sanitizePrimaryPalette([
      { hex: '#f59e0b', name: 'Goldfish Shimmer' },
      { hex: '#f97316', name: 'Fin Orange' },
      { hex: '#38bdf8', name: 'Water Aqua' }
    ]);
  }
  if (name.includes('angelfish') || name.includes('tang') || name.includes('betta') || name.includes('fish') || name.includes('manta') || (name.includes('ray') && !name.includes('praying'))) {
    return sanitizePrimaryPalette([
      { hex: '#06b6d4', name: 'Tropical Cyan' },
      { hex: '#facc15', name: 'Radiant Yellow' },
      { hex: '#ec4899', name: 'Coral Pink' }
    ]);
  }
  if (name.includes('turtle')) {
    return sanitizePrimaryPalette([
      { hex: '#15803d', name: 'Shell Green' },
      { hex: '#d97706', name: 'Warm Amber' },
      { hex: '#facc15', name: 'Sun Yellow' }
    ]);
  }
  if (name.includes('crab') || name.includes('lobster') || name.includes('shrimp')) {
    return sanitizePrimaryPalette([
      { hex: '#ef4444', name: 'Claw Red' },
      { hex: '#f97316', name: 'Shell Orange' },
      { hex: '#facc15', name: 'Sand Gold' }
    ]);
  }
  if (name.includes('octopus') || name.includes('squid')) {
    return sanitizePrimaryPalette([
      { hex: '#ec4899', name: 'Octo Pink' },
      { hex: '#a855f7', name: 'Lilac Purple' },
      { hex: '#06b6d4', name: 'Reef Cyan' }
    ]);
  }
  if (name.includes('jellyfish')) {
    return sanitizePrimaryPalette([
      { hex: '#f472b6', name: 'Glow Pink' },
      { hex: '#06b6d4', name: 'Neon Aqua' },
      { hex: '#a855f7', name: 'Electric Violet' }
    ]);
  }
  if (name.includes('seahorse')) {
    return sanitizePrimaryPalette([
      { hex: '#facc15', name: 'Golden Seahorse' },
      { hex: '#f472b6', name: 'Coral Pink' },
      { hex: '#14b8a6', name: 'Lagoon Teal' }
    ]);
  }
  if (name.includes('starfish')) {
    return sanitizePrimaryPalette([
      { hex: '#f97316', name: 'Star Orange' },
      { hex: '#facc15', name: 'Bright Gold' },
      { hex: '#38bdf8', name: 'Ocean Splash' }
    ]);
  }
  if (name.includes('seal') || name.includes('walrus')) {
    return sanitizePrimaryPalette([
      { hex: '#38bdf8', name: 'Frost Blue' },
      { hex: '#f472b6', name: 'Nose Pink' },
      { hex: '#d97706', name: 'Sand Amber' }
    ]);
  }
  if (name.includes('penguin')) {
    return sanitizePrimaryPalette([
      { hex: '#0284c7', name: 'Polar Blue' },
      { hex: '#f97316', name: 'Beak Orange' },
      { hex: '#facc15', name: 'Sun Yellow' }
    ]);
  }

  // === 22. BIRDS ===
  if (name.includes('cardinal')) {
    return sanitizePrimaryPalette([
      { hex: '#ef4444', name: 'Cardinal Red' },
      { hex: '#ea580c', name: 'Crimson Amber' },
      { hex: '#facc15', name: 'Beak Gold' }
    ]);
  }
  if (name.includes('lovebird') || name.includes('parrot') || name.includes('macaw') || name.includes('lorikeet')) {
    return sanitizePrimaryPalette([
      { hex: '#ef4444', name: 'Scarlet Red' },
      { hex: '#22c55e', name: 'Jungle Green' },
      { hex: '#facc15', name: 'Sun Gold' }
    ]);
  }
  if (name.includes('cockatoo')) {
    return sanitizePrimaryPalette([
      { hex: '#facc15', name: 'Crest Sunny Gold' },
      { hex: '#fb7185', name: 'Cheek Coral' },
      { hex: '#38bdf8', name: 'Sky Cyan' }
    ]);
  }
  if (name.includes('goldcrest') || name.includes('canary') || name.includes('goldfinch') || name.includes('finch') || name.includes('sparrow') || name.includes('kakapo')) {
    return sanitizePrimaryPalette([
      { hex: '#facc15', name: 'Canary Yellow' },
      { hex: '#b45309', name: 'Wing Brown' },
      { hex: '#f97316', name: 'Warm Orange' }
    ]);
  }
  if (name.includes('fairy wren') || name.includes('blue motmot') || name.includes('bluebird') || name.includes('kingfisher') || name.includes('jay') || name.includes('swallow') || name.includes('booby')) {
    return sanitizePrimaryPalette([
      { hex: '#2563eb', name: 'Cobalt Blue' },
      { hex: '#06b6d4', name: 'Cyan Aqua' },
      { hex: '#facc15', name: 'Feather Gold' }
    ]);
  }
  if (name.includes('quetzal') && !name.includes('quetzalcoatlus')) {
    return sanitizePrimaryPalette([
      { hex: '#10b981', name: 'Resplendent Emerald' },
      { hex: '#ef4444', name: 'Ruby Chest Red' },
      { hex: '#facc15', name: 'Gold Beak' }
    ]);
  }
  if (name.includes('spoonbill') || name.includes('ibis') || name.includes('flamingo')) {
    return sanitizePrimaryPalette([
      { hex: '#f472b6', name: 'Flamingo Pink' },
      { hex: '#ef4444', name: 'Scarlet Coral' },
      { hex: '#f97316', name: 'Sunset Orange' }
    ]);
  }
  if (name.includes('toucan') || name.includes('hornbill') || name.includes('hoopoe') || name.includes('hoatzin')) {
    return sanitizePrimaryPalette([
      { hex: '#f97316', name: 'Beak Orange' },
      { hex: '#facc15', name: 'Sun Yellow' },
      { hex: '#06b6d4', name: 'Cyan Feather' }
    ]);
  }
  if (name.includes('owl')) {
    return sanitizePrimaryPalette([
      { hex: '#f59e0b', name: 'Amber Eyes' },
      { hex: '#78350f', name: 'Bark Brown' },
      { hex: '#b45309', name: 'Light Brown' }
    ]);
  }
  if (name.includes('peacock')) {
    return sanitizePrimaryPalette([
      { hex: '#0284c7', name: 'Royal Blue' },
      { hex: '#10b981', name: 'Emerald Teal' },
      { hex: '#eab308', name: 'Feather Eye' }
    ]);
  }
  if (name.includes('hummingbird')) {
    return sanitizePrimaryPalette([
      { hex: '#14b8a6', name: 'Jewel Teal' },
      { hex: '#ec4899', name: 'Blossom Pink' },
      { hex: '#facc15', name: 'Glow Gold' }
    ]);
  }
  if (name.includes('robin') || name.includes('waxwing')) {
    return sanitizePrimaryPalette([
      { hex: '#2563eb', name: 'Cobalt Blue' },
      { hex: '#ea580c', name: 'Breast Orange' },
      { hex: '#facc15', name: 'Feather Gold' }
    ]);
  }
  if (name.includes('eagle') || name.includes('hawk') || name.includes('falcon') || name.includes('vulture') || name.includes('osprey') || name.includes('secretary')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'Eagle Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#f59e0b', name: 'Talon Gold' }
    ]);
  }
  if (name.includes('puffin')) {
    return sanitizePrimaryPalette([
      { hex: '#f97316', name: 'Beak Orange' },
      { hex: '#0284c7', name: 'Sea Blue' },
      { hex: '#facc15', name: 'Cheek Gold' }
    ]);
  }
  if (name.includes('woodpecker')) {
    return sanitizePrimaryPalette([
      { hex: '#ef4444', name: 'Crest Red' },
      { hex: '#78350f', name: 'Bark Brown' },
      { hex: '#f59e0b', name: 'Warm Amber' }
    ]);
  }
  if (name.includes('pelican') || name.includes('seagull') || name.includes('albatross') || name.includes('stork') || name.includes('crane') || name.includes('heron')) {
    return sanitizePrimaryPalette([
      { hex: '#06b6d4', name: 'Sky Cyan' },
      { hex: '#f59e0b', name: 'Beak Amber' },
      { hex: '#f97316', name: 'Sunset Coral' }
    ]);
  }
  if (name.includes('cockatiel') || name.includes('parakeet')) {
    return sanitizePrimaryPalette([
      { hex: '#facc15', name: 'Crest Yellow' },
      { hex: '#f97316', name: 'Cheek Orange' },
      { hex: '#10b981', name: 'Feather Green' }
    ]);
  }
  if (name.includes('pigeon') || name.includes('dove') || name.includes('dodo')) {
    return sanitizePrimaryPalette([
      { hex: '#a855f7', name: 'Lavender Gray' },
      { hex: '#f472b6', name: 'Neck Rose' },
      { hex: '#38bdf8', name: 'Sky Cyan' }
    ]);
  }
  if (name.includes('ostrich') || name.includes('emu') || name.includes('kiwi') || name.includes('roadrunner') || name.includes('kookaburra') || name.includes('lyrebird') || name.includes('cuckoo') || name.includes('songbird')) {
    return sanitizePrimaryPalette([
      { hex: '#854d0e', name: 'Feather Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#f59e0b', name: 'Safari Gold' }
    ]);
  }
  if (name.includes('umbrellabird')) {
    return sanitizePrimaryPalette([
      { hex: '#4338ca', name: 'Midnight Indigo' },
      { hex: '#ef4444', name: 'Throat Scarlet' },
      { hex: '#f59e0b', name: 'Beak Amber' }
    ]);
  }
  if (name.includes('crow') || name.includes('raven') || name.includes('magpie')) {
    return sanitizePrimaryPalette([
      { hex: '#4338ca', name: 'Midnight Indigo' },
      { hex: '#7e22ce', name: 'Royal Violet' },
      { hex: '#facc15', name: 'Eye Gold' }
    ]);
  }

  // === 23. DINOSAURS ===
  if (name.includes('t rex') || name.includes('tyrannosaurus') || name.includes('carnotaurus') || name.includes('allosaurus') || name.includes('dino')) {
    return sanitizePrimaryPalette([
      { hex: '#15803d', name: 'Hunter Green' },
      { hex: '#ea580c', name: 'Roar Rust' },
      { hex: '#84cc16', name: 'Claw Lime' }
    ]);
  }
  if (name.includes('triceratops') || name.includes('styracosaurus') || name.includes('protoceratops') || name.includes('microceratus')) {
    return sanitizePrimaryPalette([
      { hex: '#b45309', name: 'Shield Brown' },
      { hex: '#f59e0b', name: 'Horn Gold' },
      { hex: '#16a34a', name: 'Fern Green' }
    ]);
  }
  if (name.includes('brachiosaur') || name.includes('apatosaurus') || name.includes('diplodocus') || name.includes('sauropod') || name.includes('plesiosaur')) {
    return sanitizePrimaryPalette([
      { hex: '#0284c7', name: 'Brachio Blue' },
      { hex: '#10b981', name: 'Crest Mint' },
      { hex: '#facc15', name: 'Sun Yellow' }
    ]);
  }
  if (name.includes('stegosaur') || name.includes('ankylosaur') || name.includes('euoplocephalus')) {
    return sanitizePrimaryPalette([
      { hex: '#ea580c', name: 'Plate Orange' },
      { hex: '#eab308', name: 'Spike Yellow' },
      { hex: '#15803d', name: 'Dino Green' }
    ]);
  }
  if (name.includes('spinosaur')) {
    return sanitizePrimaryPalette([
      { hex: '#8b5cf6', name: 'Sail Violet' },
      { hex: '#06b6d4', name: 'River Cyan' },
      { hex: '#f97316', name: 'Fin Orange' }
    ]);
  }
  if (name.includes('pterodactyl') || name.includes('pteranodon') || name.includes('pterosaur') || name.includes('quetzalcoatlus')) {
    return sanitizePrimaryPalette([
      { hex: '#06b6d4', name: 'Sky Wing' },
      { hex: '#f97316', name: 'Crest Orange' },
      { hex: '#facc15', name: 'Beak Gold' }
    ]);
  }
  if (name.includes('velociraptor') || name.includes('raptor') || name.includes('therizino') || name.includes('gallimimus') || name.includes('struthiomimus') || name.includes('deinocheirus')) {
    return sanitizePrimaryPalette([
      { hex: '#ea580c', name: 'Raptor Amber' },
      { hex: '#84cc16', name: 'Jungle Lime' },
      { hex: '#facc15', name: 'Sun Gold' }
    ]);
  }
  if (name.includes('parasaurolophus') || name.includes('maiasaura') || name.includes('corythosaurus') || name.includes('ouranosaurus') || name.includes('edmontosaurus') || name.includes('iguanodon')) {
    return sanitizePrimaryPalette([
      { hex: '#fb7185', name: 'Crest Coral' },
      { hex: '#14b8a6', name: 'Lagoon Teal' },
      { hex: '#facc15', name: 'Sunburst Gold' }
    ]);
  }
  if (name.includes('mammoth') || name.includes('megatherium')) {
    return sanitizePrimaryPalette([
      { hex: '#78350f', name: 'Mammoth Brown' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#f59e0b', name: 'Tusk Gold' }
    ]);
  }
  if (name.includes('pachycephalo')) {
    return sanitizePrimaryPalette([
      { hex: '#f59e0b', name: 'Dome Amber' },
      { hex: '#ea580c', name: 'Ridge Orange' },
      { hex: '#16a34a', name: 'Cretaceous Green' }
    ]);
  }

  // === 24. INSECTS ===
  if (name.includes('blue morpho')) {
    return sanitizePrimaryPalette([
      { hex: '#2563eb', name: 'Morpho Royal Blue' },
      { hex: '#06b6d4', name: 'Electric Cyan' },
      { hex: '#facc15', name: 'Sunburst Gold' }
    ]);
  }
  if (name.includes('butterfly') || name.includes('moth')) {
    return sanitizePrimaryPalette([
      { hex: '#ec4899', name: 'Petal Pink' },
      { hex: '#2563eb', name: 'Wing Royal Blue' },
      { hex: '#facc15', name: 'Sunburst Gold' }
    ]);
  }
  if (name.includes('bee') || name.includes('bumblebee') || name.includes('hornet')) {
    return sanitizePrimaryPalette([
      { hex: '#facc15', name: 'Honey Yellow' },
      { hex: '#ea580c', name: 'Amber Stripe' },
      { hex: '#38bdf8', name: 'Wing Cyan' }
    ]);
  }
  if (name.includes('ladybug') || name.includes('ladybird')) {
    return sanitizePrimaryPalette([
      { hex: '#ef4444', name: 'Ladybug Red' },
      { hex: '#f97316', name: 'Warm Orange' },
      { hex: '#15803d', name: 'Leaf Green' }
    ]);
  }
  if (name.includes('caterpillar') || name.includes('glowworm') || name.includes('silkworm') || name.includes('worm')) {
    return sanitizePrimaryPalette([
      { hex: '#84cc16', name: 'Apple Lime' },
      { hex: '#15803d', name: 'Leaf Green' },
      { hex: '#facc15', name: 'Sunny Head' }
    ]);
  }
  if (name.includes('dragonfly') || name.includes('damselfly') || name.includes('fairy bug')) {
    return sanitizePrimaryPalette([
      { hex: '#06b6d4', name: 'Jewel Cyan' },
      { hex: '#a855f7', name: 'Wing Violet' },
      { hex: '#84cc16', name: 'Tail Lime' }
    ]);
  }
  if (name.includes('grasshopper') || name.includes('cricket') || name.includes('mantis') || name.includes('leaf insect') || name.includes('walking stick') || name.includes('katydid')) {
    return sanitizePrimaryPalette([
      { hex: '#16a34a', name: 'Meadow Green' },
      { hex: '#84cc16', name: 'Spring Lime' },
      { hex: '#facc15', name: 'Dew Gold' }
    ]);
  }
  if (name.includes('beetle') || name.includes('scarab') || name.includes('weevil') || name.includes('shield bug') || name.includes('june bug')) {
    return sanitizePrimaryPalette([
      { hex: '#14b8a6', name: 'Jewel Teal' },
      { hex: '#f59e0b', name: 'Golden Amber' },
      { hex: '#84cc16', name: 'Emerald Lime' }
    ]);
  }
  if (name.includes('ant') || name.includes('termite') || name.includes('cicada')) {
    return sanitizePrimaryPalette([
      { hex: '#ea580c', name: 'Amber Rust' },
      { hex: '#b45309', name: 'Light Brown' },
      { hex: '#facc15', name: 'Sand Gold' }
    ]);
  }
  if (name.includes('firefly')) {
    return sanitizePrimaryPalette([
      { hex: '#fde047', name: 'Neon Glow Yellow' },
      { hex: '#f59e0b', name: 'Lantern Amber' },
      { hex: '#14b8a6', name: 'Forest Teal' }
    ]);
  }
  if (name.includes('snail') || name.includes('slug')) {
    return sanitizePrimaryPalette([
      { hex: '#f97316', name: 'Spiral Coral' },
      { hex: '#facc15', name: 'Shell Gold' },
      { hex: '#16a34a', name: 'Garden Green' }
    ]);
  }
  if (name.includes('spider') || name.includes('millipede') || name.includes('roly poly')) {
    return sanitizePrimaryPalette([
      { hex: '#7e22ce', name: 'Velvet Purple' },
      { hex: '#f59e0b', name: 'Amber Eyes' },
      { hex: '#38bdf8', name: 'Web Cyan' }
    ]);
  }

  // === 25. CATEGORY-BASED NATURAL HARMONIC FALLBACKS ===
  switch (categoryId) {
    case 'farm':
      return sanitizePrimaryPalette([
        { hex: '#b45309', name: 'Barn Light Brown' },
        { hex: '#ea580c', name: 'Harvest Amber' },
        { hex: '#f59e0b', name: 'Sunny Gold' }
      ]);
    case 'jungle':
      return sanitizePrimaryPalette([
        { hex: '#ea580c', name: 'Safari Rust' },
        { hex: '#eab308', name: 'Sun Gold' },
        { hex: '#15803d', name: 'Jungle Emerald' }
      ]);
    case 'aquatic':
      return sanitizePrimaryPalette([
        { hex: '#0284c7', name: 'Deep Sea Blue' },
        { hex: '#38bdf8', name: 'Tropical Aqua' },
        { hex: '#f97316', name: 'Coral Sunset' }
      ]);
    case 'birds':
      return sanitizePrimaryPalette([
        { hex: '#2563eb', name: 'Sky Cobalt' },
        { hex: '#ef4444', name: 'Feather Red' },
        { hex: '#facc15', name: 'Beak Gold' }
      ]);
    case 'dinosaurs':
      return sanitizePrimaryPalette([
        { hex: '#c85a3a', name: 'Terracotta Earth' },
        { hex: '#15803d', name: 'Fern Green' },
        { hex: '#f59e0b', name: 'Fossil Amber' }
      ]);
    case 'insects':
      return sanitizePrimaryPalette([
        { hex: '#ea580c', name: 'Peach Nectar' },
        { hex: '#eda737', name: 'Honey Gold' },
        { hex: '#10b981', name: 'Meadow Green' }
      ]);
    default:
      return sanitizePrimaryPalette([
        { hex: '#ef4444', name: 'Bright Red' },
        { hex: '#3b82f6', name: 'Ocean Blue' },
        { hex: '#eab308', name: 'Warm Gold' }
      ]);
  }
}
