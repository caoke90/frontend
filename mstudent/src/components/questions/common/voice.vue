
<template>
	<div class="ui-voice-wave">
		<img src="../../../assets/questions/voice-wave.gif" :class="{'visibility': run}">
		<!-- <div class="ui-voice-wave" :class="{'visibility': run}" :width="width" :height="height"></div> -->
		<canvas :width="width" :height="height" id="v-ui-voice-wave" style="opacity: 0"></canvas>
	</div>
</template>
<script>
export default {
	data() {
		return {
			count: 0,
			timer: -1,
			A: 0,
			ctx: null,
			run:false,
			countNum: 5,
			random: [0, 0, 0]
		}
	},
	mounted() {
		let width = this.width;
		this.$nextTick(() => {
			this.ctx = this.$el.querySelector('canvas').getContext('2d');
			this.ctx.canvas.width = width;
			this.ctx.canvas.height = this.height;
      this.start()
		})

	},
	props: ['width', 'height'],
	methods: {
		//设置当前波形的值，外部需要频繁调用
		setValue(value) {
			this.A = value
		},
		_clear() {
			this.ctx.clearRect(0, 0, this.width, this.height);
		},
		_drawLine(attenuation, color, width, w) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = color;
			this.ctx.lineWidth = width;
			//this.ctx.fillRect(0, 0, this.width, this.height);
			let x, y;
			this.ctx.moveTo(0, this.height / 2);
			for (var i = 0; i < this.width; i++) {
				var cosVal = (Math.cos(90 / (this.width / 4) * (i - (this.width / 2)) * Math.PI / 180) + 1) / 2;
				x = i;
				y = this.A * attenuation * cosVal * this.height / 2 * Math.sin(w * (i * Math.PI / 180 - this.count)) + this.height / 2
				this.ctx.lineTo(x, y);
			}
			this.ctx.stroke();
		},
		_draw() {
			if (!this.run) return;
			this.ctx.fillRect(0, 0, this.width, this.height);
			this.ctx.fillStyle = "white";
			this._drawLine(1, 'rgba(67,198,68,1)', 2, 0.5);
			this._drawLine(0.8, 'rgba(186,245,154,1)', 0.5, 0.5);
			this._drawLine(0.5, 'rgba(186,245,154,1)', 0.5, 0.5);
			this._drawLine(0.3, 'rgba(186,245,154,1)', 0.5, 0.5);
			this._drawLine(0.2, 'rgba(186,245,154,1)', 0.5, 0.5);

			if (this.timer) {
				//clearInterval(this.timer)
				cancelAnimationFrame(this.timer)
			}
			if(this.A < 0.3) {
				this.count += 0.2;
			} else if(this.A < 0.6) {
				this.count += 0.3;
			} else {
				this.count += 0.4;
			}
			//this.timer = setInterval(this._draw.bind(this), 16.7)
			this.timer=requestAnimationFrame(this._draw.bind(this));
		},
		_drawLine_(x, color, width, random) {
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.strokeStyle = color;
			this.ctx.lineWidth = 1;
			let ground = this.height - 4;
			let y = (ground * random).toFixed(0);
			for (var i=0; i< width; i++) {
				this.ctx.moveTo(x+i, ground);
				this.ctx.lineTo(x+i, y);
			}
			this.ctx.stroke();
		},
		_draw_() {
			if (!this.run) return;
			if (++this.countNum > 10 && this.countNum < 13) {
				this.countNum = 0;
				this.random = Array.from(Array(3), Math.random);
			}
			this.ctx.fillRect(0, 0, this.width, this.height);
			this.ctx.fillStyle = '#6DC898';
			this._drawLine_(0, 'rgba(255,255,255,1)', 3, this.random[0]);
			this._drawLine_(7, 'rgba(255,255,255,1)', 3, this.random[1]);
			this._drawLine_(13, 'rgba(255,255,255,1)', 3, this.random[2]);

			if (this.timer) cancelAnimationFrame(this.timer);

			this.timer = requestAnimationFrame(this._draw_.bind(this));
		},
		start(){
			this.run=true;
			this._draw_()
		},
		stop(){
			this.run=false;
			this._clear()
		}
	}
}
</script>
<style lang="scss" scoped>
  .ui-voice-wave {
    position: relative;
    img {
      position: absolute;
      height: 20px;
      width: 15px;
      top: -3px;
      display: none;
      &.visibility {
        display: block;
      }
    }
  }
</style>
