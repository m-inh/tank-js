'use strict';

class AnimationManager {
    constructor() {
        this.animArr = new Array();
    }

    addNewAnim(newAnim) {
        this.animArr.push(newAnim);
    }

    runAllAnim(context) {
        var tempArr = new Array();
        for (var i = 0; i < this.animArr.length; i++) {
            var anim = this.animArr[i];
            if (anim.runAnimation(context)) {
                tempArr.push(anim);
            }
        }
        this.animArr = tempArr;
    }
}
