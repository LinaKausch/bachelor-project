export default class TimerBar {
    constructor(scene, timer) {
        this.scene = scene;
        this.timer = timer;

        this.container = scene.add.container(0, 0).setDepth(100);

        this.bg = scene.add.graphics();
        this.bg.lineStyle(8, 0xffffff, 1);
        this.bg.strokeRoundedRect(50, 40, 500, 40, 20);
        this.container.add(this.bg);

    
        this.fill = scene.add.graphics();
        this.container.add(this.fill);


        this.circle = scene.add.graphics();
        this.circle.fillStyle(0x4a4f63, 1);
        this.circle.lineStyle(6, 0xffffff, 1);
        this.circle.fillCircle(600, 60, 45);
        this.circle.strokeCircle(600, 60, 45);
        this.container.add(this.circle);


        this.text = scene.add.text(600, 60, "00:00", {
            fontFamily: "Arial Black",
            fontSize: "32px",
            color: "#ffffff",
        }).setOrigin(0.5);

        this.container.setScale(0.6)
        this.container.x = 1000 - 20;
        this.container.y = 10;
        this.container.add(this.text);
    }

    update() {

        const timeLeft = Math.ceil(this.timer.getTimeLeft());
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        this.text.setText(
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );

        const maxWidth = 500;
        const percent = this.timer.getTimeLeft() / this.timer.duration;

        this.fill.clear();
        this.fill.fillStyle(0x4a6fa5, 1);
        this.fill.fillRoundedRect(50, 40, maxWidth * percent, 40, 20);
    }
}
